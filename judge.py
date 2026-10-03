# -*- coding: utf-8 -*-
"""
Chấm bằng dòng lệnh (không cần mở web), ví dụ khi bạn viết code trong Code::Blocks:
    python judge.py pf_01 C:\\duong_dan\\bai.cpp
    python judge.py --list
"""
import sys

import judge_core as jc

COLORS = {"AC": "\033[92m", "WA": "\033[91m", "TLE": "\033[93m", "RE": "\033[95m", "CE": "\033[95m"}
END = "\033[0m"


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    if len(sys.argv) >= 2 and sys.argv[1] == "--list":
        for p in jc.list_problems():
            print(f"{p['id']:10s} {p['title']}")
        return
    if len(sys.argv) < 3:
        print(__doc__)
        return
    pid, src = sys.argv[1], sys.argv[2]
    code = open(src, encoding="utf-8", errors="replace").read()
    r = jc.judge(pid, code)
    if r["verdict"] == "CE":
        print(COLORS["CE"] + "CE - Lỗi biên dịch" + END)
        print(r["compile_error"])
        return
    line = ""
    for i, t in enumerate(r["tests"], 1):
        line += f"{COLORS.get(t['verdict'], '')}{t['verdict']:>3s}{END} "
        if i % 15 == 0:
            print(line)
            line = ""
    if line:
        print(line)
    print()
    for s in r["subtasks"]:
        mark = "✔" if s["got"] else "✘"
        print(f"  Subtask {s['index']} ({s['desc']}): {mark} {s['got']}/{s['points']}  [{s['passed']}/{s['total']} test]")
    print(f"\nTỔNG: {r['score']}/{r['max_score']} điểm | chạy lâu nhất {r['max_time_ms']} ms "
          f"(giới hạn {r['time_limit_ms']} ms)")
    d = r.get("detail")
    if d:
        print(f"\nTest nhỏ nhất bị {d['verdict']}: #{d['name']} ({d['note']})")
        print("--- Input ---\n" + d["input"])
        if d["verdict"] == "WA":
            print("--- Đáp án ---\n" + d["expected"])
            print("--- Bạn in ra ---\n" + d["output"])
        if d["error"]:
            print("--- Lỗi ---\n" + d["error"])


if __name__ == "__main__":
    main()
