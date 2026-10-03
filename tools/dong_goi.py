# -*- coding: utf-8 -*-
"""Đóng gói project thành file zip (bỏ test/exe tự sinh để file nhẹ).
Chạy:  python tools/dong_goi.py      -> tạo ../hsg-dsa.zip
"""
import os
import sys
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP_DIRS = {"tests", "build", "__pycache__", ".claude", ".git", "hsg-dsa"}


def main():
    out = os.path.join(os.path.dirname(ROOT), "hsg-dsa.zip")
    n = 0
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
        for d, dirs, files in os.walk(ROOT):
            dirs[:] = sorted(x for x in dirs if x not in SKIP_DIRS)
            for f in sorted(files):
                if f.endswith((".pyc", ".exe")) or f.startswith("sc_log"):
                    continue
                full = os.path.join(d, f)
                z.write(full, os.path.join("hsg-dsa", os.path.relpath(full, ROOT)))
                n += 1
    print(f"Đã tạo {out} ({n} file, {os.path.getsize(out) // 1024} KB)")


if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    main()
