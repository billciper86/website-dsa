# -*- coding: utf-8 -*-
"""
Hướng dẫn "code cùng" từng bước.
Lời giải chuẩn sol.cpp được chia bằng các dòng mốc:
    // [BƯỚC 2] Tiêu đề bước
    // > Giải thích (có thể nhiều dòng "// >")
Mỗi bước gồm: giải thích, khung code có chỗ trống (tự sinh), code mẫu, và danh sách kiểm tra
(tự sinh từ các cấu trúc quan trọng trong đoạn code mẫu: vòng for, sort, lower_bound, % ...).
"""
import os
import re

import judge_core as jc
from analyzer import strip_code
from debugger import split_top

MARK = re.compile(r"^\s*//\s*\[BƯỚC\s*(\d+)\]\s*(.*)$")
EXPL = re.compile(r"^\s*//\s*>\s?(.*)$")

# (regex trên code đã bỏ chú thích, nhãn kiểm tra)
FEATURES = [
    (r"\bfor\s*\(", "Có vòng lặp for"),
    (r"\bwhile\s*\(", "Có vòng lặp while"),
    (r"\bcin\s*>>", "Có đọc dữ liệu bằng cin"),
    (r"\bcout\s*<<", "Có in kết quả bằng cout"),
    (r"sync_with_stdio", "Có bật đọc/ghi nhanh"),
    (r"\blong\s+long\b", "Có dùng long long"),
    (r"\bsort\s*\(", "Có sắp xếp (sort)"),
    (r"\blower_bound\s*\(", "Có dùng lower_bound"),
    (r"\bupper_bound\s*\(", "Có dùng upper_bound"),
    (r"\bmap\s*<", "Có dùng map"),
    (r"\bset\s*<", "Có dùng set"),
    (r"\bqueue\s*<", "Có dùng hàng đợi queue"),
    (r"\bpriority_queue\s*<", "Có dùng priority_queue"),
    (r"\bvector\s*<", "Có dùng vector"),
    (r"\bpush_back\s*\(", "Có thêm phần tử (push_back)"),
    (r"\bpush\s*\(", "Có đưa vào hàng đợi (push)"),
    (r"\bpop\s*\(", "Có lấy ra khỏi hàng đợi (pop)"),
    (r"\bmax\s*\(", "Có lấy max"),
    (r"\bmin\s*\(", "Có lấy min"),
    (r"%", "Có phép chia lấy dư %"),
    (r"<<\s*\w+\s*\)|1\s*<<|>>\s*\w+\s*&|>>=", "Có thao tác bit"),
    (r"__builtin_popcount", "Có đếm bit (__builtin_popcount)"),
    (r"__gcd|\bgcd\s*\(", "Có tính ƯCLN"),
    (r"\[\s*\w+\s*-\s*1\s*\]", "Có dùng phần tử ngay trước (chỉ số … − 1)"),
    (r"\[\s*\w+\s*\+\s*1\s*\]", "Có dùng phần tử ngay sau (chỉ số … + 1)"),
    (r"\+=", "Có cộng dồn (+=)"),
    (r"-=", "Có trừ bớt (-=)"),
    (r"\.erase\s*\(", "Có xóa khỏi cấu trúc (erase)"),
    (r"\bbreak\s*;", "Có dừng sớm (break)"),
    (r"\breturn\s+true", "Có trả về true khi đủ điều kiện"),
    (r"\blo\b.*\bhi\b|\bhi\b.*\blo\b", "Có biến lo / hi của tìm kiếm nhị phân"),
    (r"\bdx\b|\bdy\b", "Có mảng hướng đi dx / dy"),
    (r"\bvis\w*\s*\[|\bdist\w*\s*\[|\bcomp\s*\[", "Có mảng đánh dấu / khoảng cách"),
    (r"\bdp\s*\[|\bf\s*\[", "Có bảng quy hoạch động"),
    (r"\bnext_permutation\b", "Có thử hoán vị (next_permutation)"),
    (r"\bswap\s*\(", "Có hoán đổi (swap)"),
    (r"\babs\s*\(|\bllabs\s*\(", "Có lấy giá trị tuyệt đối"),
]

BLANK = "/* ? */"
LITERAL = re.compile(r"^(-?\d+(LL)?|true|false|LLONG_MAX|LLONG_MIN|INT_MAX|INF|NEG|\{\}|\{0\}|'.'|\"\")$")


def scaffold_line(line):
    """Biến 1 dòng code mẫu thành dòng 'khung' có chỗ trống để học sinh tự điền."""
    code, cmt = line, ""
    m = re.search(r"\s//(?!.*\")", line)
    if m:
        code, cmt = line[:m.start()], ""          # bỏ chú thích cuối dòng (thường lộ đáp án)
    st = code.strip()
    if not st or st.startswith("#") or st.startswith("using ") or st in ("{", "}", "};") or re.match(r"^(int|signed)\s+main\s*\(", st):
        return code.rstrip()
    ind = code[: len(code) - len(code.lstrip())]
    # for (A; B; C)  ->  giữ A, C ; xóa điều kiện B
    mf = re.match(r"^(\s*for\s*\()([^;]*);([^;]*);(.*)$", code)
    if mf:
        return f"{mf.group(1)}{mf.group(2)}; {BLANK};{mf.group(4)}".rstrip()
    if re.match(r"^\s*while\s*\(\s*\w+\s*--\s*\)", code):        # while (q--): lặp q lần, giữ nguyên
        return code.rstrip()
    md = re.match(r"^(\s*(?:static\s+)?(?:long\s+long|int|ll|bool|double|auto|char|string)\s+)(.+);\s*$", code)
    if md and len(split_top(md.group(2))) > 1:                     # long long lo = 1, hi = ..., ans = 0;
        parts = []
        for p in split_top(md.group(2)):
            if "=" in p:
                nm, ex = p.split("=", 1)
                parts.append(f"{nm.strip()} = {ex.strip() if LITERAL.match(ex.strip()) else BLANK}")
            else:
                parts.append(p.strip())
        return f"{md.group(1)}{', '.join(parts)};"
    for kw in ("if", "while"):
        mi = re.match(r"^(\s*(?:\}\s*else\s+)?" + kw + r"\s*\()(.*)$", code)
        if mi:
            depth, k = 1, 0
            rest = mi.group(2)
            for k, ch in enumerate(rest):
                depth += (ch == "(") - (ch == ")")
                if depth == 0:
                    break
            return (mi.group(1) + BLANK + rest[k:]).rstrip()
    mr = re.match(r"^(\s*return\s+)(.+);\s*$", code)
    if mr and mr.group(2).strip() not in ("0", "true", "false"):
        return f"{mr.group(1)}{BLANK};"
    mc = re.match(r"^(\s*cout\s*<<\s*)(.*?)(\s*<<\s*'\\n'\s*;|\s*<<\s*endl\s*;|;)\s*$", code)
    if mc:
        return f"{mc.group(1)}{BLANK}{mc.group(3)}"
    ma = re.match(r"^(.*?[^=!<>+\-*/%&|^])(=|\+=|-=|\*=|%=)([^=].*);\s*$", code)
    if ma and not LITERAL.match(ma.group(3).strip()):
        return f"{ma.group(1)}{ma.group(2)} {BLANK};"
    return code.rstrip()


def checks_for(chunk):
    s = strip_code(chunk)
    out = []
    for rx, label in FEATURES:
        if re.search(rx, s):
            out.append({"re": rx, "label": label})
    return out[:6]


def parse_steps(pid):
    path = os.path.join(jc.PROBLEMS_DIR, pid, "sol.cpp")
    lines = jc.read_text(path).split("\n")
    steps, cur = [], None
    for ln in lines:
        m = MARK.match(ln)
        if m:
            cur = {"title": m.group(2).strip(), "explain": [], "code": []}
            steps.append(cur)
            continue
        e = EXPL.match(ln)
        if e and cur is not None and not cur["code"]:
            cur["explain"].append(e.group(1))
            continue
        if cur is None:
            if not steps and ln.strip() and not ln.strip().startswith("//"):
                cur = {"title": "Khung chương trình", "explain": [], "code": []}
                steps.append(cur)
            else:
                continue
        cur["code"].append(ln)
    out = []
    for st in steps:
        while st["code"] and not st["code"][-1].strip():
            st["code"].pop()
        code = "\n".join(st["code"])
        out.append({
            "title": st["title"],
            "explain": " ".join(st["explain"]),
            "code": code,
            "scaffold": "\n".join(scaffold_line(x) for x in st["code"]),
            "checks": checks_for(code),
        })
    return out
