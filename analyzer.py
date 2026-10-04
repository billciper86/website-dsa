# -*- coding: utf-8 -*-
"""
Trợ lý code: phân tích tĩnh code C++ của học sinh (không cần chạy).
 - Tìm lỗi hay gặp, trả về vị trí (dòng, cột) để editor gạch chân.
 - Nhận diện "hướng tư duy" (2 vòng for, đệ quy thử hết, thử hoán vị/tập con...)
   rồi gợi ý cách tối ưu riêng cho từng bài (dữ liệu trong problems/hints_data.py).
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(ROOT, "problems"))
try:
    from hints_data import HINTS
except Exception:  # pragma: no cover
    HINTS = {}


# ------------------------------------------------------------ tiền xử lý

def strip_code(code):
    """Thay chú thích và chuỗi bằng dấu cách (giữ nguyên vị trí, giữ xuống dòng)."""
    out = list(code)
    i, n = 0, len(code)
    while i < n:
        c = code[i]
        if c == "/" and i + 1 < n and code[i + 1] == "/":
            while i < n and code[i] != "\n":
                out[i] = " "; i += 1
        elif c == "/" and i + 1 < n and code[i + 1] == "*":
            j = code.find("*/", i + 2)
            j = n if j < 0 else j + 2
            for k in range(i, j):
                if code[k] != "\n":
                    out[k] = " "
            i = j
        elif c in "\"'":
            j = i + 1
            while j < n and code[j] != c and code[j] != "\n":
                j += 2 if code[j] == "\\" else 1
            for k in range(i + 1, min(j, n)):
                out[k] = " "
            i = j + 1
        elif c == "#":
            while i < n and code[i] != "\n":   # bỏ dòng #include ...
                out[i] = " "; i += 1
        else:
            i += 1
    return "".join(out)


class Ctx:
    def __init__(self, code):
        self.code = code
        self.s = strip_code(code)
        self.line_starts = [0]
        for m in re.finditer(r"\n", code):
            self.line_starts.append(m.end())

    def pos(self, off):
        """offset -> (dòng từ 1, cột từ 0)"""
        lo, hi = 0, len(self.line_starts) - 1
        while lo < hi:
            mid = (lo + hi + 1) // 2
            if self.line_starts[mid] <= off:
                lo = mid
            else:
                hi = mid - 1
        return lo + 1, off - self.line_starts[lo]

    def line_text(self, line):
        a = self.line_starts[line - 1]
        b = self.code.find("\n", a)
        return self.code[a: b if b >= 0 else len(self.code)]


def finding(ctx, start, end, sev, title, why, fix="", better="", kind="loi"):
    line, col = ctx.pos(start)
    line2, col2 = ctx.pos(max(start, end))
    if line2 != line:
        col2 = len(ctx.line_text(line))
    if col2 <= col:   # cả dòng (bỏ thụt lề)
        t = ctx.line_text(line)
        col = len(t) - len(t.lstrip())
        col2 = len(t.rstrip())
    return {"line": line, "from": col, "to": max(col + 1, col2), "sev": sev, "title": title,
            "why": why, "fix": fix, "better": better, "kind": kind}


# ------------------------------------------------------------ cấu trúc vòng lặp

def match_paren(s, i, o="(", c=")"):
    d = 0
    for j in range(i, len(s)):
        if s[j] == o:
            d += 1
        elif s[j] == c:
            d -= 1
            if d == 0:
                return j
    return len(s) - 1


def stmt_end(s, i):
    """Vị trí kết thúc câu lệnh bắt đầu tại i (khối {..}, vòng lặp lồng, hoặc tới dấu ;)."""
    while i < len(s) and s[i].isspace():
        i += 1
    if i >= len(s):
        return i
    if s[i] == "{":
        return match_paren(s, i, "{", "}")
    m = re.match(r"(for|while|if)\s*\(", s[i:])
    if m:
        h = match_paren(s, i + m.end() - 1)
        e = stmt_end(s, h + 1)
        if m.group(1) == "if":
            m2 = re.match(r"\s*else\b", s[e + 1:])
            if m2:
                e = stmt_end(s, e + 1 + m2.end())
        return e
    j = s.find(";", i)
    return len(s) - 1 if j < 0 else j


def loops(ctx):
    """Danh sách vòng lặp: (vị trí, header, kết thúc thân, có phải vòng 'nhỏ' (<=100 lần) không)."""
    s = ctx.s
    res = []
    for m in re.finditer(r"\b(for|while)\s*\(", s):
        h0 = m.end() - 1
        h1 = match_paren(s, h0)
        header = s[h0 + 1: h1]
        body_end = stmt_end(s, h1 + 1)
        body = s[h1 + 1: body_end + 1]
        mnum = re.search(r"<=?\s*(\d+)\s*;", header)
        small = bool(mnum) and int(mnum.group(1)) <= 100                                # chạy hằng số lần
        small = small or bool(re.search(r"\b(\w+)\s*<\s*(4|8|26|2)\b", header))
        small = small or bool(re.search(r":\s*adj\b|:\s*adj\s*\[", header))             # danh sách kề: tổng O(m)
        small = small or bool(re.search(r"(\w+)\s*\*\s*\1\s*<=", header))               # tới căn n
        small = small or bool(re.search(r"\blo\s*<=?\s*hi\b", header))                  # chặt nhị phân
        small = small or bool(re.search(r"!\s*\w+\.empty\s*\(", header))                # BFS: tổng O(n+m)
        if m.group(1) == "while" and not re.search(r"\w+\s*--|--\s*\w+|\btrue\b|changed", header):
            small = True    # while co cửa sổ / Euclid / lũy thừa nhanh: không nhân thêm độ phức tạp
        res.append({"start": m.start(), "header": header, "end": body_end, "small": small, "kw": m.group(1)})
    for L in res:
        L["depth"] = 1 + sum(1 for P in res if P is not L and P["start"] < L["start"] <= P["end"] and not P["small"])
    return res


# ------------------------------------------------------------ hướng tư duy

def detect_approach(ctx, lps):
    s = ctx.s
    big = [L for L in lps if not L["small"]]
    maxd = max([L["depth"] for L in big], default=0)
    funcs = re.findall(r"\b(?:void|int|long\s+long|ll|bool|long)\s+(\w+)\s*\([^;{]*\)\s*\{", s)
    recursive = []
    for f in funcs:
        if f == "main":
            continue
        m = re.search(r"\b" + f + r"\s*\([^;{]*\)\s*\{", s)
        if m:
            body_end = match_paren(s, m.end() - 1, "{", "}")
            if re.search(r"\b" + f + r"\s*\(", s[m.end(): body_end]):
                recursive.append(f)
    memo = bool(re.search(r"memo|dp\s*\[|f\s*\[", s))
    if "next_permutation" in s:
        return {"id": "perm", "name": "Thử mọi hoán vị (next_permutation)", "cx": "O(n!·n)"}
    if re.search(r"<\s*\(?\s*1(?:LL)?\s*<<", s):
        return {"id": "subset", "name": "Thử mọi tập con (bitmask)", "cx": "O(2ⁿ·n)"}
    if recursive and not memo:
        return {"id": "recursion", "name": f"Đệ quy thử mọi khả năng (hàm {recursive[0]})", "cx": "hàm mũ"}
    if maxd >= 3:
        return {"id": "nested3", "name": f"{maxd} vòng lặp lồng nhau", "cx": f"O(n^{maxd})"}
    if maxd == 2:
        return {"id": "nested", "name": "2 vòng lặp lồng nhau", "cx": "O(n²)"}
    if maxd == 1:
        return {"id": "linear", "name": "1 vòng lặp chính", "cx": "O(n) hoặc O(n log n)"}
    return {"id": "none", "name": "Chưa nhận diện được", "cx": "?"}


# ------------------------------------------------------------ luật chung

INT_DECL = re.compile(r"\b(?:int|vector\s*<\s*int\s*>)\s+([^;]+);")


def declared_names(decl):
    names = []
    for part in re.split(r",(?![^\[\(]*[\]\)])", decl):
        m = re.match(r"\s*&?\s*(\w+)", part)
        if m:
            names.append((m.group(1), m.start(1)))
    return names


def rule_int_overflow(ctx, flags, out):
    if not flags.get("ll"):
        return
    s = ctx.s
    for m in INT_DECL.finditer(s):
        for name, rel in declared_names(m.group(1)):
            if name in ("main", "n", "m", "q", "T", "t", "k") or len(name) == 0:
                continue
            nm = re.escape(name)
            acc = re.search(nm + r"\s*(\[[^\]]*\])*\s*(\+=|\*=)", s) or \
                  re.search(nm + r"\s*\[[^\]]*\]\s*=\s*" + nm + r"\s*\[[^\]]*\]\s*[+*]", s) or \
                  re.search(r"\b" + nm + r"\s*=\s*" + nm + r"\s*[+*]", s) or \
                  re.search(r"\b" + nm + r"\s*\*\s*" + nm + r"\b", s)
            if not acc:
                continue
            st = m.start(1) + rel
            out.append(finding(ctx, st, st + len(name), "error", f"Biến `{name}` kiểu int có thể bị tràn số",
                               f"`{name}` được cộng dồn hoặc nhân lên nhiều lần. Với giới hạn của bài, giá trị có thể vượt 2.147.483.647 (giới hạn của int). Khi tràn, kết quả quay về số âm hoặc sai mà không báo lỗi.",
                               f"long long {name}  // hoặc vector<long long>",
                               "long long chứa được tới khoảng 9,2·10¹⁸, đủ cho mọi tổng/tích trong đề HSG. Chi phí gần như không đổi."))


def rule_square_int(ctx, flags, out):
    s = ctx.s
    for m in re.finditer(r"for\s*\(\s*int\s+(\w+)\s*=[^;]*;\s*(\1\s*\*\s*\1)\s*<=?", s):
        if flags.get("ll") or flags.get("big_value"):
            out.append(finding(ctx, m.start(2), m.end(2), "error", "Tích i*i bị tràn khi i là int",
                               "Khi n tới 10¹², i chạy tới 10⁶ nên i*i tới 10¹² > 2,1·10⁹. Kiểu int bị tràn khiến điều kiện dừng sai, vòng lặp chạy mãi hoặc dừng sớm.",
                               f"for (long long {m.group(1)} = 1; {m.group(1)} * {m.group(1)} <= n; {m.group(1)}++)",
                               "Khai báo biến chạy là long long thì phép nhân thực hiện trên 64 bit, không tràn."))


def rule_sqrt(ctx, flags, out):
    for m in re.finditer(r"\bsqrt\s*\(", ctx.s):
        out.append(finding(ctx, m.start(), m.end() - 1, "warn", "sqrt() dùng số thực, có thể sai số",
                           "sqrt trả về double. Với n lớn (≥ 10¹²), kết quả có thể lệch 1 đơn vị, ví dụ sqrt(999999999999) bị làm tròn thành 1000000.",
                           "for (long long d = 1; d * d <= n; d++)",
                           "So sánh d*d <= n hoàn toàn bằng số nguyên nên luôn chính xác."))


def rule_fastio(ctx, flags, out):
    s = ctx.s
    if flags.get("big_input") and re.search(r"\bcin\s*>>", s) and "sync_with_stdio" not in s:
        m = re.search(r"\bint\s+main\s*\(", s)
        st = m.start() if m else 0
        out.append(finding(ctx, st, st + 8, "warn", "Thiếu đọc nhanh (ios::sync_with_stdio)",
                           "Input có tới hàng trăm nghìn số. cin mặc định đồng bộ với scanf nên chậm gấp 3–5 lần, dễ bị TLE oan dù thuật toán đúng.",
                           "ios::sync_with_stdio(false);\ncin.tie(nullptr);",
                           "Tắt đồng bộ thì cin đọc theo khối lớn, nhanh ngang scanf. Đặt ở đầu main, trước mọi lệnh cin/cout."))


def rule_endl(ctx, flags, out, lps):
    for m in re.finditer(r"\bendl\b", ctx.s):
        if any(L["start"] < m.start() <= L["end"] for L in lps):
            out.append(finding(ctx, m.start(), m.end(), "warn", "endl trong vòng lặp làm chậm",
                               "Mỗi lần endl đều ép xả bộ đệm ra màn hình. In 10⁵ dòng thì có 10⁵ lần xả, rất chậm.",
                               "cout << x << '\\n';",
                               "'\\n' chỉ xuống dòng, dữ liệu được gom lại rồi in một lần nên nhanh hơn nhiều."))
            break


def rule_local_array(ctx, flags, out):
    s = ctx.s
    depth = 0
    i = 0
    for m in re.finditer(r"[{}]|\b(?:int|long\s+long|ll|bool|char|double)\s+(\w+)((?:\s*\[\s*[\w*+\-\s]+\])+)\s*[;={]", s):
        t = m.group(0)
        if t == "{":
            depth += 1; continue
        if t == "}":
            depth -= 1; continue
        if depth < 1:
            continue
        size = 1
        for dim in re.findall(r"\[\s*([^\]]+)\]", m.group(2)):
            dim = dim.strip()
            try:
                size *= int(eval(dim.replace("e", "*10**") if re.fullmatch(r"[\d+\-*e ]+", dim) else "0"))
            except Exception:
                size *= 0
        if size >= 300000:
            out.append(finding(ctx, m.start(1), m.end(1), "error", "Mảng lớn khai báo trong hàm → tràn stack",
                               f"Mảng `{m.group(1)}` có khoảng {size:,} phần tử nằm trên stack (thường chỉ 1–8 MB). Chương trình có thể bị RE ngay khi chạy.".replace(",", "."),
                               f"// đưa ra ngoài main (biến toàn cục)\n{m.group(0).strip().rstrip(';={').strip()};",
                               "Mảng toàn cục nằm ở vùng nhớ tĩnh (giới hạn theo bộ nhớ đề, 256 MB) và tự khởi tạo bằng 0."))


def rule_lcm(ctx, flags, out):
    for m in re.finditer(r"\b(\w+)\s*\*\s*(\w+)\s*/\s*(?:__)?gcd\b|\b(\w+)\s*\*\s*(\w+)\s*/\s*g\b", ctx.s):
        a, b = (m.group(1), m.group(2)) if m.group(1) else (m.group(3), m.group(4))
        out.append(finding(ctx, m.start(), m.end(), "error", "Nhân trước rồi mới chia → tràn",
                           f"Tích {a}*{b} có thể lớn hơn nhiều so với kết quả cuối (a, b tới 10¹⁸ thì tích tới 10³⁶), vượt long long.",
                           f"{a} / g * {b}",
                           "Chia trước cho g (luôn chia hết) để giữ số trung gian nhỏ; kết quả không đổi."))


def rule_mod(ctx, flags, out):
    in_loop = any("%" in ctx.s[L["start"]: L["end"] + 1] for L in loops(ctx))
    if flags.get("mod") and not in_loop:
        m = re.search(r"\bint\s+main\s*\(", ctx.s)
        st = m.start() if m else 0
        out.append(finding(ctx, st, st + 8, "error", "Thiếu phép mod 10⁹+7",
                           "Đề yêu cầu in kết quả mod 10⁹+7 vì đáp án thật rất lớn (hàng trăm chữ số). Không mod sau mỗi phép tính thì long long tràn từ rất sớm.",
                           "const long long MOD = 1000000007;\nf[i][j] = (f[i-1][j] + f[i][j-1]) % MOD;",
                           "(a + b) mod M = ((a mod M) + (b mod M)) mod M nên mod ngay ở mỗi bước vẫn ra đúng kết quả cuối, và số luôn nhỏ hơn M."))


def rule_max_init0(ctx, flags, out):
    if not flags.get("neg"):
        return
    s = ctx.s
    for m in re.finditer(r"\b(\w+)\s*=\s*0\s*[;,]", s):
        nm = re.escape(m.group(1))
        if re.search(r"\b" + nm + r"\s*=\s*max\s*\(\s*" + nm + r"\b|max\s*\(\s*" + nm + r"\s*,|max\s*\(\s*0", s):
            out.append(finding(ctx, m.start(), m.end() - 1, "error", f"`{m.group(1)} = 0` sai khi mọi số đều âm",
                               "Dãy có thể toàn số âm, khi đó đáp án đúng là một số âm. Khởi tạo 0 thì max(...) không bao giờ xuống dưới 0, nên in ra 0 là sai.",
                               f"{m.group(1)} = a[0];   // hoặc LLONG_MIN",
                               "Khởi tạo bằng một giá trị có thật (phần tử đầu / cửa sổ đầu) đảm bảo đáp án là của một đoạn khác rỗng."))
            return


def rule_size_minus(ctx, flags, out):
    for m in re.finditer(r"\.size\(\)\s*-\s*1", ctx.s):
        out.append(finding(ctx, m.start(), m.end(), "warn", "size() - 1 với xâu/vector rỗng",
                           "size() trả về số KHÔNG DẤU. Nếu rỗng thì 0 - 1 thành 18446744073709551615 chứ không phải -1, vòng lặp chạy sai.",
                           "(int)s.size() - 1",
                           "Ép về int trước khi trừ thì kết quả đúng là -1 khi rỗng."))


def rule_specific(ctx, hint, out):
    s = ctx.s
    for r in hint.get("rules", []):
        if "absent" in r:
            trig = re.search(r["if"], s)
            if trig and not re.search(r["absent"], s):
                out.append(finding(ctx, trig.start(), trig.end(), r.get("sev", "error"), r["title"], r["why"], r.get("fix", ""), r.get("better", "")))
        else:
            m = re.search(r["re"], s)
            if m:
                out.append(finding(ctx, m.start(), m.end(), r.get("sev", "error"), r["title"], r["why"], r.get("fix", ""), r.get("better", "")))


# ------------------------------------------------------------ hàm chính

def analyze(pid, code, verdict=None, score=None, max_score=None):
    hint = HINTS.get(pid, {})
    flags = hint.get("flags", {})
    ctx = Ctx(code)
    lps = loops(ctx)
    out = []
    rule_specific(ctx, hint, out)
    rule_int_overflow(ctx, flags, out)
    rule_square_int(ctx, flags, out)
    rule_lcm(ctx, flags, out)
    rule_local_array(ctx, flags, out)
    rule_mod(ctx, flags, out)
    rule_max_init0(ctx, flags, out)
    rule_sqrt(ctx, flags, out)
    rule_fastio(ctx, flags, out)
    rule_endl(ctx, flags, out, lps)
    rule_size_minus(ctx, flags, out)
    # bỏ trùng (cùng dòng + cùng tiêu đề)
    seen, uniq = set(), []
    for f in out:
        k = (f["line"], f["title"])
        if k not in seen:
            seen.add(k); uniq.append(f)

    approach = detect_approach(ctx, lps)
    opt = hint.get("opt")
    suggestion = None
    if opt:
        slow = approach["id"] in opt.get("slow", []) or verdict == "TLE"
        sre = re.search(opt["slow_re"], ctx.s) if opt.get("slow_re") else None
        if sre:
            slow = True
            approach = {"id": "special", "name": opt.get("slow_name", approach["name"]), "cx": opt.get("slow_cx", approach["cx"])}
        full = score is not None and max_score is not None and score >= max_score
        if slow and not full:
            # đánh dấu vòng lặp ngoài cùng (nếu lồng nhau) là chỗ cần tối ưu
            big = [L for L in lps if not L["small"]]
            anchor = None
            if approach["id"] in ("nested", "nested3") and big:
                inner = max(big, key=lambda L: L["depth"])
                outer = [L for L in big if L["start"] <= inner["start"] <= L["end"] and L["depth"] == 1]
                anchor = (outer[0] if outer else inner)["start"]
            elif approach["id"] in ("perm",):
                anchor = ctx.s.find("next_permutation")
            elif approach["id"] == "subset":
                m = re.search(r"1(?:LL)?\s*<<", ctx.s); anchor = m.start() if m else None
            elif approach["id"] == "recursion":
                m = re.search(r"\b(?:void|int|long\s+long|ll|bool)\s+(\w+)\s*\(", ctx.s)
                anchor = m.start(1) if m and m.group(1) != "main" else None
            elif sre:
                anchor = sre.start()
            elif big:
                anchor = big[0]["start"]
            if anchor is not None and anchor >= 0:
                f = finding(ctx, anchor, anchor, "opt", f"Có thể tối ưu: {opt['name']}",
                            f"Hướng hiện tại: {approach['name']} ({approach['cx']}). {opt['idea']}",
                            opt.get("code", ""), opt.get("why", ""), kind="toiuu")
                uniq.append(f)
            suggestion = {"from": approach, "to": opt}
    uniq.sort(key=lambda f: ({"error": 0, "opt": 1, "warn": 2}.get(f["sev"], 3), f["line"]))
    return {"findings": uniq, "approach": approach, "suggestion": suggestion,
            "optimal_note": None if suggestion or not opt else f"Hướng của bạn ({approach['name']}) phù hợp với lời giải tối ưu: {opt['name']}."}
