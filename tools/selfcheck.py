# -*- coding: utf-8 -*-
"""
Tự kiểm tra bộ test của các bài:
  - sinh test, kiểm tra mọi test đúng giới hạn đề (validate) và có >= 70 test
  - lời giải chuẩn sol.cpp phải được 100 điểm, chạy nhanh hơn 1/2 giới hạn thời gian
  - brute.cpp và wrong_*.cpp (có dòng "// KY_VONG: <điểm>") phải ra ĐÚNG số điểm kỳ vọng
    -> chứng minh test biên / test lớn / test anti thực sự bắt được lời giải sai.
Chạy:  python tools/selfcheck.py            (tất cả bài)
       python tools/selfcheck.py pf_01 pf_02
"""
import glob
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import judge_core as jc  # noqa: E402


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    ids = sys.argv[1:] or [p["id"] for p in jc.list_problems()]
    all_ok = True
    for pid in ids:
        d = os.path.join(jc.PROBLEMS_DIR, pid)
        meta = jc.load_problem(pid)
        try:
            man = jc.ensure_tests(pid, log=lambda m: None)
        except Exception as e:
            print(f"\n=== {pid}: LỖI SINH TEST: {e}")
            all_ok = False
            continue
        n = man["count"]
        per = {}
        for t in man["tests"]:
            per[t["subtask"]] = per.get(t["subtask"], 0) + 1
        sol_max = max(t["sol_ms"] for t in man["tests"])
        tl = int(meta["time_limit"] * 1000)
        ok = n >= 70 and len(per) == len(meta["subtasks"]) and sol_max * 2 < tl
        print(f"\n=== {pid} ({meta['title']}): {n} test, theo subtask {dict(sorted(per.items()))}, "
              f"sol chạy lâu nhất {sol_max} ms / {tl} ms  {'OK' if ok else 'LỖI'}")
        all_ok &= ok
        # Ví dụ trong đề phải khớp với output của lời giải chuẩn
        st = meta["statement"]
        ins = re.findall(r"```input\n(.*?)```", st, re.S)
        outs = re.findall(r"```output\n(.*?)```", st, re.S)
        exe, _ = jc.compile_cpp(jc.read_text(os.path.join(d, "sol.cpp")), tag=f"sol_{pid}")
        for k, (i_, o_) in enumerate(zip(ins, outs), 1):
            r = jc.run_exe(exe, i_, 5)
            same = r["status"] == "OK" and jc.same_output(r["out"], o_)
            all_ok &= same
            print(f"  ví dụ {k} trong đề: {'khớp' if same else '<<< KHÔNG KHỚP: sol in ra ' + r['out'].strip()[:80]}")
        if not ins:
            print("  <<< đề không có ví dụ"); all_ok = False
        cands = [("sol.cpp", 100)]
        for f in [os.path.join(d, "brute.cpp")] + sorted(glob.glob(os.path.join(d, "wrong_*.cpp"))):
            if os.path.isfile(f):
                m = re.search(r"KY_VONG:\s*(\d+)", jc.read_text(f))
                cands.append((os.path.basename(f), int(m.group(1)) if m else None))
        for name, expect in cands:
            r = jc.judge(pid, jc.read_text(os.path.join(d, name)), log=lambda m: None)
            subs = " ".join(f"{s['got']}/{s['points']}" for s in r.get("subtasks", []))
            good = expect is None or r["score"] == expect
            all_ok &= good
            extra = ""
            if r["verdict"] == "CE":
                extra = r["compile_error"][:300]
            print(f"  {name:22s} {r['verdict']:3s} {r['score']:3d} điểm (kỳ vọng {expect})  [{subs}]  "
                  f"{'OK' if good else '<<< SAI KỲ VỌNG'} {extra}")
    print("\nKẾT QUẢ:", "TẤT CẢ ĐẠT" if all_ok else "CÓ LỖI")
    sys.exit(0 if all_ok else 1)


if __name__ == "__main__":
    main()
