# -*- coding: utf-8 -*-
"""
Server chạy trên máy bạn: mở website ôn thi + nhận code C++ để chấm.
Chạy:  python server.py      (hoặc nhấp đúp CHAY_WEB.bat)
Chỉ lắng nghe ở 127.0.0.1 nên máy khác trong mạng không truy cập được.
"""
import json
import mimetypes
import os
import sys
import threading
import traceback
import webbrowser
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, unquote

import analyzer
import debugger
import judge_core as jc
import steps

ROOT = jc.ROOT
WEB = os.path.join(ROOT, "web")
CONTENT = os.path.join(ROOT, "content")
PORT = int(os.environ.get("PORT", "8686"))
VERSION = 4          # tăng mỗi khi thêm API; web dùng để phát hiện server cũ còn chạy


def stop_old_server(port):
    """Nếu cổng đang bị một server ôn thi bản CŨ chiếm thì yêu cầu nó tắt. Trả về True nếu đã giải phóng."""
    import urllib.request
    import json as _json
    try:
        with urllib.request.urlopen(f"http://127.0.0.1:{port}/api/status", timeout=2) as r:
            info = _json.loads(r.read().decode("utf-8"))
    except Exception:
        return False
    if info.get("version", 0) >= VERSION:
        return False
    try:
        req = urllib.request.Request(f"http://127.0.0.1:{port}/api/shutdown", data=b"{}", method="POST")
        urllib.request.urlopen(req, timeout=2)
    except Exception:
        print(f"  [!] Cổng {port} đang bị server bản CŨ chiếm. Hãy đóng cửa sổ đen cũ (hoặc nhấn Ctrl+C trong đó).")
        return False
    import time as _t
    _t.sleep(1.0)
    return True

mimetypes.add_type("text/markdown; charset=utf-8", ".md")
mimetypes.add_type("application/javascript; charset=utf-8", ".js")
mimetypes.add_type("text/css; charset=utf-8", ".css")
mimetypes.add_type("application/json; charset=utf-8", ".json")


def safe_join(base, rel):
    p = os.path.normpath(os.path.join(base, rel.lstrip("/\\")))
    if not p.startswith(os.path.normpath(base)):
        return None
    return p


class Handler(BaseHTTPRequestHandler):
    server_version = "HSGJudge/1.0"

    def log_message(self, fmt, *args):
        if args and "/api/" in str(args[0]):
            sys.stdout.write("  " + (fmt % args) + "\n")

    def send_json(self, obj, code=200):
        data = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(data)

    def send_file(self, path):
        if not path or not os.path.isfile(path):
            self.send_error(404, "Không tìm thấy")
            return
        ctype = mimetypes.guess_type(path)[0] or "application/octet-stream"
        if ctype.startswith("text/") and "charset" not in ctype:
            ctype += "; charset=utf-8"
        with open(path, "rb") as f:
            data = f.read()
        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-cache")
        self.end_headers()
        self.wfile.write(data)

    # ------------------------------------------------------------ GET
    def do_GET(self):
        path = unquote(urlparse(self.path).path)
        try:
            if path == "/api/status":
                return self.send_json({"ok": True, "gpp": jc.gpp_version(), "gpp_path": jc.GPP, "version": VERSION})
            if path == "/api/problems":
                return self.send_json(jc.list_problems())
            if path.startswith("/api/problem/"):
                return self.send_json(jc.load_problem(path.split("/")[-1]))
            if path.startswith("/api/steps/"):
                pid = path.split("/")[-1]
                jc.load_problem(pid)
                return self.send_json(steps.parse_steps(pid))
            if path.startswith("/api/solution/"):
                pid = path.split("/")[-1]
                jc.load_problem(pid)  # kiểm tra mã bài hợp lệ
                d = os.path.join(jc.PROBLEMS_DIR, pid)
                brute = os.path.join(d, "brute.cpp")
                return self.send_json({
                    "code": jc.read_text(os.path.join(d, "sol.cpp")),
                    "brute": "\n".join(l for l in jc.read_text(brute).splitlines()
                                       if "KY_VONG" not in l) if os.path.isfile(brute) else "",
                })
            if path.startswith("/content/"):
                return self.send_file(safe_join(CONTENT, path[len("/content/"):]))
            if path == "/":
                path = "/index.html"
            if path == "/favicon.ico":
                self.send_response(204)
                self.end_headers()
                return
            return self.send_file(safe_join(WEB, path))
        except Exception as e:
            traceback.print_exc()
            return self.send_json({"error": str(e)}, 500)

    # ------------------------------------------------------------ POST
    def do_POST(self):
        path = urlparse(self.path).path
        try:
            n = int(self.headers.get("Content-Length", "0"))
            body = json.loads(self.rfile.read(n).decode("utf-8") or "{}")
            if path == "/api/judge":
                print(f"  -> Chấm bài {body.get('id')}")
                res = jc.judge(body["id"], body["code"], log=lambda m: print("  " + m))
                print(f"  <- {res['verdict']}  {res['score']}/{res['max_score']} điểm")
                try:
                    res["analysis"] = analyzer.analyze(body["id"], body["code"], res["verdict"],
                                                       res.get("score"), res.get("max_score"))
                except Exception:
                    traceback.print_exc()
                return self.send_json(res)
            if path == "/api/shutdown":          # bản server mới hơn yêu cầu bản cũ tắt để nhường cổng
                threading.Thread(target=self.server.shutdown, daemon=True).start()
                return self.send_json({"ok": True})
            if path == "/api/debug":
                inp = body.get("input", "")
                if len(inp) > 20000:
                    return self.send_json({"status": "ERR", "error": "Input quá lớn để gỡ lỗi (tối đa 20.000 ký tự). Hãy dùng test nhỏ."})
                return self.send_json(debugger.debug_run(body.get("code", ""), inp))
            if path == "/api/analyze":
                return self.send_json(analyzer.analyze(body.get("id", ""), body.get("code", ""),
                                                       body.get("verdict"), body.get("score"), body.get("max_score")))
            if path == "/api/run":
                return self.send_json(jc.run_custom(body.get("code", ""), body.get("input", "")))
            return self.send_json({"error": "Không có API này"}, 404)
        except Exception as e:
            traceback.print_exc()
            return self.send_json({"error": str(e)}, 500)


def main():
    print("=" * 60)
    print("  WEBSITE ÔN THI HSG TIN HỌC - DSA")
    print("=" * 60)
    v = jc.gpp_version()
    if v:
        print(f"  g++ : {v}\n        ({jc.GPP})")
    else:
        print("  [!] KHÔNG tìm thấy g++. Website vẫn chạy nhưng không chấm được bài.")
        print("      Xem phần 'Cài g++' trong HUONG_DAN.md")
    port = PORT
    httpd = None
    if stop_old_server(PORT):
        print("  Đã tắt server bản cũ đang chạy.")
    for p in range(port, port + 20):
        try:
            httpd = ThreadingHTTPServer(("127.0.0.1", p), Handler)
            port = p
            break
        except OSError:
            continue
    if httpd is None:
        print("Không mở được cổng mạng nào từ", PORT)
        return
    url = f"http://127.0.0.1:{port}/"
    print(f"  Website: {url}")
    print("  Giữ cửa sổ này mở trong lúc học. Nhấn Ctrl+C để tắt.")
    print("=" * 60)
    if "--no-browser" not in sys.argv:
        threading.Timer(0.8, lambda: webbrowser.open(url)).start()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nĐã tắt server.")


if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        try:
            sys.stdout.reconfigure(encoding="utf-8")
        except Exception:
            pass
    main()
