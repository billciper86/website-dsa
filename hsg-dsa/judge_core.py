# -*- coding: utf-8 -*-
"""
Lõi chấm bài: tìm g++, biên dịch, sinh test, chạy và so sánh output.
Chỉ dùng thư viện chuẩn của Python (không cần pip install).
Dùng chung cho server.py (chấm trên web) và judge.py (chấm bằng dòng lệnh).
"""
import hashlib
import importlib.util
import json
import os
import random
import shutil
import subprocess
import sys
import threading
import time
from concurrent.futures import ThreadPoolExecutor

ROOT = os.path.dirname(os.path.abspath(__file__))
PROBLEMS_DIR = os.path.join(ROOT, "problems")
BUILD_DIR = os.path.join(ROOT, "build")
IS_WIN = os.name == "nt"
EXE_EXT = ".exe" if IS_WIN else ""

# Cờ biên dịch giống phòng thi; tăng stack lên 256MB để DFS đệ quy sâu không bị RE oan.
CXX_FLAGS = ["-O2", "-std=c++17", "-static", "-pipe"]
if IS_WIN:
    CXX_FLAGS += ["-Wl,--stack=268435456"]

# Các chỗ hay cài g++ trên Windows (MSYS2, Code::Blocks, MinGW, Dev-C++)
GPP_CANDIDATES = [
    r"C:\msys64\ucrt64\bin\g++.exe",
    r"C:\msys64\mingw64\bin\g++.exe",
    r"C:\Program Files\CodeBlocks\MinGW\bin\g++.exe",
    r"C:\Program Files (x86)\CodeBlocks\MinGW\bin\g++.exe",
    r"C:\MinGW\bin\g++.exe",
    r"C:\Program Files (x86)\Dev-Cpp\MinGW64\bin\g++.exe",
]

_lock = threading.Lock()
_problem_locks = {}


def find_gpp():
    """Tìm g++: ưu tiên biến môi trường GPP, rồi PATH, rồi các thư mục cài đặt phổ biến."""
    env = os.environ.get("GPP")
    if env and os.path.isfile(env):
        return env
    p = shutil.which("g++")
    if p:
        return p
    for c in GPP_CANDIDATES:
        if os.path.isfile(c):
            return c
    return None


GPP = find_gpp()


def gpp_env():
    """Thêm thư mục chứa g++ vào PATH (cần cho cc1plus/as khi g++ không nằm trong PATH)."""
    env = dict(os.environ)
    if GPP:
        env["PATH"] = os.path.dirname(GPP) + os.pathsep + env.get("PATH", "")
    return env


def gpp_version():
    if not GPP:
        return None
    try:
        out = subprocess.run([GPP, "--version"], capture_output=True, text=True,
                             timeout=10, env=gpp_env()).stdout
        return out.splitlines()[0] if out else GPP
    except Exception:
        return None


# ---------------------------------------------------------------- biên dịch

def compile_cpp(code, tag="user"):
    """Biên dịch code C++. Trả về (exe_path, None) hoặc (None, thông báo lỗi).
    Code giống nhau được cache theo mã băm nên không biên dịch lại."""
    if not GPP:
        return None, ("Không tìm thấy g++. Hãy cài MSYS2/MinGW hoặc Code::Blocks bản có MinGW, "
                      "hoặc đặt biến môi trường GPP trỏ tới g++.exe")
    os.makedirs(BUILD_DIR, exist_ok=True)
    h = hashlib.sha1((" ".join(CXX_FLAGS) + "\n" + code).encode("utf-8")).hexdigest()[:16]
    exe = os.path.join(BUILD_DIR, f"{tag}_{h}{EXE_EXT}")
    if os.path.isfile(exe):
        return exe, None
    src = os.path.join(BUILD_DIR, f"{tag}_{h}.cpp")
    with open(src, "w", encoding="utf-8", newline="\n") as f:
        f.write(code)
    try:
        r = subprocess.run([GPP, *CXX_FLAGS, src, "-o", exe], capture_output=True,
                           text=True, encoding="utf-8", errors="replace",
                           timeout=60, env=gpp_env())
    except subprocess.TimeoutExpired:
        return None, "Biên dịch quá 60 giây."
    if r.returncode != 0 or not os.path.isfile(exe):
        msg = (r.stderr or r.stdout or "Lỗi biên dịch không rõ").replace(src, "main.cpp")
        return None, msg[-6000:]
    return exe, None


# ---------------------------------------------------------------- chạy chương trình

WIN_CODES = {
    0xC0000005: "Truy cập bộ nhớ không hợp lệ (vượt chỉ số mảng / con trỏ lỗi)",
    0xC00000FD: "Tràn stack (đệ quy quá sâu hoặc mảng cục bộ quá lớn)",
    0xC0000094: "Chia cho 0 (số nguyên)",
    0xC0000095: "Tràn số khi chia (ví dụ INT_MIN / -1)",
    0xC0000409: "Chương trình tự hủy (abort / lỗi kiểm tra vector.at, assert...)",
    0xC0000017: "Hết bộ nhớ",
}


def explain_exit(code):
    if code is None:
        return ""
    u = code & 0xFFFFFFFF
    if u in WIN_CODES:
        return f"{WIN_CODES[u]} (mã 0x{u:08X})"
    if u == 3:
        return "Chương trình gọi abort() (mã 3)"
    return f"Mã thoát {code} (main phải return 0)"


def _cpu_time_win(handle):
    """Thời gian CPU (user + kernel) của tiến trình trên Windows, tính bằng giây."""
    import ctypes
    from ctypes import wintypes
    ft = [wintypes.FILETIME() for _ in range(4)]
    ok = ctypes.windll.kernel32.GetProcessTimes(wintypes.HANDLE(int(handle)), *[ctypes.byref(f) for f in ft])
    if not ok:
        return None
    val = lambda f: (f.dwHighDateTime << 32 | f.dwLowDateTime) / 1e7
    return val(ft[2]) + val(ft[3])


def run_exe(exe, input_text, time_limit, max_out=64 * 1024 * 1024):
    """Chạy exe với input. Trả về dict: status (OK/TLE/RE), out, time_ms, err.
    Thời gian được đo bằng thời gian CPU (giống Codeforces) nên không bị ảnh hưởng khi
    nhiều test chạy song song; tiến trình bị dừng hẳn nếu chạy quá 2x giới hạn (thời gian thực)."""
    t0 = time.perf_counter()
    p = subprocess.Popen([exe], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    try:
        stdout, stderr = p.communicate(input_text.encode("utf-8"), timeout=time_limit * 2 + 0.3)
    except subprocess.TimeoutExpired:
        p.kill()
        p.communicate()
        # killed=True: chạy quá gấp đôi giới hạn -> chắc chắn TLE, không cần chạy lại
        return {"status": "TLE", "out": "", "time_ms": int((time.perf_counter() - t0) * 1000),
                "err": "", "killed": True}
    el = time.perf_counter() - t0
    if IS_WIN:
        cpu = _cpu_time_win(p._handle)
        if cpu is not None:
            el = cpu
    p = subprocess.CompletedProcess([exe], p.returncode, stdout, stderr)
    out = p.stdout[:max_out].decode("utf-8", errors="replace")
    err = p.stderr[:4000].decode("utf-8", errors="replace")
    if el > time_limit:
        return {"status": "TLE", "out": out, "time_ms": int(el * 1000), "err": err}
    if p.returncode != 0:
        return {"status": "RE", "out": out, "time_ms": int(el * 1000),
                "err": (explain_exit(p.returncode) + ("\n" + err if err else "")).strip()}
    return {"status": "OK", "out": out, "time_ms": int(el * 1000), "err": err}


def same_output(a, b):
    """So sánh bỏ qua khoảng trắng / xuống dòng thừa."""
    return a.split() == b.split()


# ---------------------------------------------------------------- bài tập & test

def list_problems():
    res = []
    if not os.path.isdir(PROBLEMS_DIR):
        return res
    for pid in sorted(os.listdir(PROBLEMS_DIR)):
        pj = os.path.join(PROBLEMS_DIR, pid, "problem.json")
        if os.path.isfile(pj):
            with open(pj, encoding="utf-8") as f:
                meta = json.load(f)
            meta["id"] = pid
            res.append(meta)
    return res


def load_problem(pid):
    if not pid or not all(c.isalnum() or c in "_-" for c in pid):
        raise ValueError("Mã bài không hợp lệ")
    d = os.path.join(PROBLEMS_DIR, pid)
    with open(os.path.join(d, "problem.json"), encoding="utf-8") as f:
        meta = json.load(f)
    meta["id"] = pid
    st = os.path.join(d, "statement.md")
    meta["statement"] = open(st, encoding="utf-8").read() if os.path.isfile(st) else ""
    return meta


def read_text(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def load_gen(pid):
    path = os.path.join(PROBLEMS_DIR, pid, "gen.py")
    spec = importlib.util.spec_from_file_location(f"gen_{pid}", path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def _fingerprint(pid):
    d = os.path.join(PROBLEMS_DIR, pid)
    h = hashlib.sha1()
    for name in ("gen.py", "sol.cpp", "problem.json"):
        with open(os.path.join(d, name), "rb") as f:
            h.update(f.read())
    return h.hexdigest()


def ensure_tests(pid, log=print):
    """Sinh test (nếu chưa có hoặc gen.py/sol.cpp đã đổi) rồi tạo đáp án bằng lời giải chuẩn.
    Trả về manifest: danh sách test {name, subtask, note, size}."""
    with _lock:
        lk = _problem_locks.setdefault(pid, threading.Lock())
    with lk:
        d = os.path.join(PROBLEMS_DIR, pid)
        tdir = os.path.join(d, "tests")
        mpath = os.path.join(tdir, "manifest.json")
        fp = _fingerprint(pid)
        if os.path.isfile(mpath):
            with open(mpath, encoding="utf-8") as f:
                man = json.load(f)
            if man.get("fingerprint") == fp:
                return man
        meta = load_problem(pid)
        log(f"[{pid}] Đang sinh test lần đầu (chỉ làm một lần)...")
        gen = load_gen(pid)
        rng = random.Random(getattr(gen, "SEED", 2024))
        tests = list(gen.tests(rng))
        sol_exe, err = compile_cpp(read_text(os.path.join(d, "sol.cpp")), tag=f"sol_{pid}")
        if err:
            raise RuntimeError(f"Lời giải chuẩn {pid} lỗi biên dịch:\n{err}")
        if os.path.isdir(tdir):
            shutil.rmtree(tdir)
        os.makedirs(tdir)
        items = []

        def make(i_t):
            i, t = i_t
            sub, inp, note = t[0], t[1], (t[2] if len(t) > 2 else "")
            if hasattr(gen, "validate"):
                gen.validate(inp, sub)  # kiểm tra test đúng giới hạn đề
            r = run_exe(sol_exe, inp, time_limit=30)
            if r["status"] != "OK":
                raise RuntimeError(f"Lời giải chuẩn {pid} lỗi ở test {i + 1}: {r['status']} {r['err']}")
            name = f"{i + 1:03d}"
            with open(os.path.join(tdir, name + ".in"), "w", encoding="utf-8", newline="\n") as f:
                f.write(inp)
            with open(os.path.join(tdir, name + ".out"), "w", encoding="utf-8", newline="\n") as f:
                f.write(r["out"])
            return {"name": name, "subtask": sub, "note": note, "size": len(inp),
                    "sol_ms": r["time_ms"]}

        with ThreadPoolExecutor(max_workers=WORKERS) as ex:
            items = list(ex.map(make, enumerate(tests)))
        man = {"fingerprint": fp, "tests": items, "count": len(items)}
        with open(mpath, "w", encoding="utf-8") as f:
            json.dump(man, f, ensure_ascii=False, indent=1)
        log(f"[{pid}] Đã sinh {len(items)} test.")
        return man


WORKERS = max(1, min(4, (os.cpu_count() or 2) // 2))


def judge(pid, code, log=print):
    """Chấm code cho bài pid. Trả về dict kết quả đầy đủ."""
    meta = load_problem(pid)
    t_start = time.perf_counter()
    exe, err = compile_cpp(code)
    if err:
        return {"verdict": "CE", "compile_error": err, "score": 0,
                "max_score": sum(s["points"] for s in meta["subtasks"]), "tests": [],
                "subtasks": []}
    man = ensure_tests(pid, log)
    tl = float(meta.get("time_limit", 1.0))
    tdir = os.path.join(PROBLEMS_DIR, pid, "tests")

    def one(t):
        inp = read_text(os.path.join(tdir, t["name"] + ".in"))
        exp = read_text(os.path.join(tdir, t["name"] + ".out"))
        r = run_exe(exe, inp, tl)
        v = r["status"]
        if v == "OK":
            v = "AC" if same_output(r["out"], exp) else "WA"
        return {"name": t["name"], "subtask": t["subtask"], "note": t.get("note", ""),
                "verdict": v, "time_ms": r["time_ms"], "size": t["size"],
                "_killed": r.get("killed", False),
                "_inp": inp, "_exp": exp, "_out": r["out"], "_err": r["err"]}

    with ThreadPoolExecutor(max_workers=WORKERS) as ex:
        results = list(ex.map(one, man["tests"]))
    # Chạy song song có thể làm chậm oan: test TLE "sát nút" được chạy lại MỘT MÌNH để xác nhận
    for i, r in enumerate(results):
        if r["verdict"] == "TLE" and not r["_killed"]:
            results[i] = one(man["tests"][i])

    subs = []
    score = 0
    for i, s in enumerate(meta["subtasks"], start=1):
        rs = [r for r in results if r["subtask"] == i]
        ok = all(r["verdict"] == "AC" for r in rs) and len(rs) > 0
        got = s["points"] if ok else 0
        score += got
        subs.append({"index": i, "points": s["points"], "got": got, "desc": s.get("desc", ""),
                     "passed": sum(r["verdict"] == "AC" for r in rs), "total": len(rs)})

    # Chi tiết test sai NHỎ NHẤT (ưu tiên WA, rồi RE, rồi TLE)
    detail = None
    for kind in ("WA", "RE", "TLE"):
        bad = [r for r in results if r["verdict"] == kind]
        if bad:
            b = min(bad, key=lambda r: r["size"])
            cut = lambda s, n=3000: s if len(s) <= n else s[:n] + "\n... (đã cắt bớt)"
            detail = {"name": b["name"], "verdict": kind, "note": b["note"], "subtask": b["subtask"],
                      "input": cut(b["_inp"]), "expected": cut(b["_exp"]),
                      "output": cut(b["_out"]), "error": b["_err"]}
            break

    verdicts = {r["verdict"] for r in results}
    overall = "AC"
    for v in ("WA", "RE", "TLE"):
        if v in verdicts:
            overall = v
            break
    tests_out = [{k: v for k, v in r.items() if not k.startswith("_")} for r in results]
    max_score = sum(s["points"] for s in meta["subtasks"])
    return {"verdict": overall, "score": score, "max_score": max_score, "subtasks": subs,
            "tests": tests_out, "detail": detail,
            "max_time_ms": max((r["time_ms"] for r in results), default=0),
            "time_limit_ms": int(tl * 1000),
            "total_s": round(time.perf_counter() - t_start, 2)}


def run_custom(code, input_text, time_limit=3.0):
    """Nút 'Chạy thử' trong editor: biên dịch rồi chạy với input tự nhập."""
    exe, err = compile_cpp(code)
    if err:
        return {"status": "CE", "compile_error": err}
    r = run_exe(exe, input_text, time_limit, max_out=200000)
    return r
