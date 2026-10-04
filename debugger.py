# -*- coding: utf-8 -*-
"""
Bộ gỡ lỗi (debugger) không cần gdb:
  1. Phân tích code C++ của học sinh, chèn lệnh ghi vết __hsgT(dòng, "tên", biến, ...) trước MỖI câu lệnh
     trong các hàm (biết biến nào đang trong phạm vi nhờ theo dõi khai báo + khối { }).
  2. Biên dịch & chạy với input nhỏ, ghi lại tối đa MAXEV bước: dòng đang chạy, giá trị biến, độ dài output.
  3. Trả về danh sách bước để web phát lại: bước tới / lùi / breakpoint / xem biến / xem mảng.
"""
import os
import re
import subprocess
import time
import uuid

import judge_core as jc
from analyzer import strip_code, match_paren

MAXEV = 3000

PRELUDE = r'''#include <bits/stdc++.h>
namespace hsgdbg {
template<class T, class = void> struct is_iter : std::false_type {};
template<class T> struct is_iter<T, std::void_t<decltype(std::begin(std::declval<const T&>())), decltype(std::end(std::declval<const T&>()))>> : std::true_type {};
template<class T, class = void> struct has_size : std::false_type {};
template<class T> struct has_size<T, std::void_t<decltype(std::size(std::declval<const T&>()))>> : std::true_type {};
template<class T, class = void> struct has_top : std::false_type {};
template<class T> struct has_top<T, std::void_t<decltype(std::declval<const T&>().top()), decltype(std::declval<const T&>().size())>> : std::true_type {};
template<class T, class = void> struct has_front : std::false_type {};
template<class T> struct has_front<T, std::void_t<decltype(std::declval<const T&>().front()), decltype(std::declval<const T&>().size())>> : std::true_type {};
template<class T> struct is_pair : std::false_type {};
template<class A, class B> struct is_pair<std::pair<A, B>> : std::true_type {};
template<class T> constexpr bool is_str = std::is_same_v<std::decay_t<T>, std::string>;
template<class T> constexpr bool is_scalar_like = std::is_arithmetic_v<std::decay_t<T>> || is_str<T> || is_pair<std::decay_t<T>>::value;
const int LIM = 16, ROWS = 10;
inline void esc(std::string &o, const std::string &s) {
    for (char c : s) o += (c == '\t' || c == '\n' || c == '\r' || (c >= 1 && c <= 4)) ? ' ' : c;
}
template<class T> void put(std::string &o, const T &v, int d);
template<class T> long long count_of(const T &v) {
    if constexpr (has_size<T>::value) return (long long)std::size(v);
    else return -1;
}
template<class T> void put(std::string &o, const T &v, int d) {
    using U = std::decay_t<T>;
    if constexpr (std::is_same_v<U, bool>) o += v ? "true" : "false";
    else if constexpr (std::is_same_v<U, char>) { o += '\''; o += (v >= 32 && v < 127) ? v : '?'; o += '\''; }
    else if constexpr (std::is_integral_v<U>) o += std::to_string(v);
    else if constexpr (std::is_floating_point_v<U>) { char b[40]; snprintf(b, 40, "%.6g", (double)v); o += b; }
    else if constexpr (is_str<U>) { o += '"'; esc(o, v.size() > 60 ? v.substr(0, 60) + "..." : v); o += '"'; }
    else if constexpr (is_pair<U>::value) { o += '('; put(o, v.first, d + 1); o += ','; put(o, v.second, d + 1); o += ')'; }
    else if constexpr (is_iter<U>::value) {
        if (d >= 2) { o += "[..]"; return; }
        o += '['; int k = 0;
        for (auto it = std::begin(v); it != std::end(v) && k < LIM; ++it, ++k) { if (k) o += ','; put(o, *it, d + 1); }
        long long n = count_of(v);
        if (n > LIM) o += ",...(" + std::to_string(n) + ")";
        o += ']';
    }
    else if constexpr (has_top<U>::value) { o += "size=" + std::to_string(v.size()); if (v.size()) { o += " top="; put(o, v.top(), d + 1); } }
    else if constexpr (has_front<U>::value) { o += "size=" + std::to_string(v.size()); if (v.size()) { o += " front="; put(o, v.front(), d + 1); } }
    else o += "?";
}
// 1 biến -> "\t tên \x01 loại \x01 nội dung"  (loại: s = đơn, a = mảng 1 chiều, g = mảng 2 chiều)
template<class T> void one(std::string &o, const char *name, const T &v) {
    using U = std::decay_t<T>;
    o += '\t'; o += name; o += '\x01';
    if constexpr (is_iter<U>::value && !is_str<U>) {
        using E = std::decay_t<decltype(*std::begin(v))>;
        if constexpr (is_scalar_like<E>) {
            o += "a\x01" + std::to_string(count_of(v)) + '\x01';
            int k = 0;
            for (auto it = std::begin(v); it != std::end(v) && k < 40; ++it, ++k) { if (k) o += '\x02'; put(o, *it, 1); }
            return;
        } else if constexpr (is_iter<E>::value && !is_str<E>) {
            o += "g\x01" + std::to_string(count_of(v)) + '\x01';
            int r = 0;
            for (auto it = std::begin(v); it != std::end(v) && r < ROWS; ++it, ++r) {
                if (r) o += '\x03';
                int k = 0;
                for (auto jt = std::begin(*it); jt != std::end(*it) && k < LIM; ++jt, ++k) { if (k) o += '\x02'; put(o, *jt, 2); }
            }
            return;
        }
    }
    o += "s\x01"; put(o, v, 0);
}
struct CountBuf : std::streambuf {
    std::streambuf *orig = nullptr; long long cnt = 0;
    int overflow(int c) override { if (c != EOF) { cnt++; return orig->sputc((char)c); } return c; }
    std::streamsize xsputn(const char *s, std::streamsize n) override { cnt += n; return orig->sputn(s, n); }
    int sync() override { return orig ? orig->pubsync() : 0; }
};
inline CountBuf *cb() { static CountBuf *b = new CountBuf; return b; }
inline long long &nev() { static long long n = 0; return n; }
inline FILE *tf() {
    static FILE *f = []() {
        const char *p = std::getenv("HSG_TRACE");
        FILE *x = p ? std::fopen(p, "w") : nullptr;
        std::atexit([]() { FILE *g = tf(); if (g) { std::fprintf(g, "N\t%lld\n", nev()); std::fflush(g); } });
        return x;
    }();
    return f;
}
inline void rec(std::string &) {}
template<class V, class... R> void rec(std::string &o, const char *n, const V &v, const R &...r) { one(o, n, v); rec(o, r...); }
template<class... A> void T(int line, const A &...a) {
    if (std::cout.rdbuf() != cb()) { cb()->orig = std::cout.rdbuf(); std::cout.rdbuf(cb()); }
    long long &k = nev(); k++;
    FILE *f = tf();
    if (!f || k > 3000) return;
    std::string o = "L\t" + std::to_string(line) + "\t" + std::to_string(cb()->cnt);
    rec(o, a...);
    o += '\n';
    std::fputs(o.c_str(), f);
    std::fflush(f);               // ghi ngay: chương trình bị lỗi giữa chừng vẫn còn vết
}
}
#define __hsgT(...) ::hsgdbg::T(__VA_ARGS__)
'''

TYPE_RE = re.compile(
    r"^\s*(?:(?:static|const|constexpr|unsigned|signed|register)\s+)*"
    r"(?:long\s+long|long\s+double|unsigned\s+long\s+long|long|int|short|double|float|bool|char|string|std::string|auto|size_t|ll|ull|ld|int64_t|uint64_t|"
    r"(?:std::)?(?:vector|map|set|multiset|multimap|unordered_map|unordered_set|pair|queue|stack|deque|priority_queue|array|bitset|tuple|list)\s*<.*>)"
    r"\s*[&*]*\s*(.+)$", re.S)
KEYWORDS = {"return", "if", "for", "while", "else", "switch", "case", "default", "break", "continue", "do",
            "cout", "cin", "printf", "scanf", "new", "delete", "sizeof", "true", "false", "nullptr", "goto"}


def split_top(s, sep=","):
    parts, depth, cur = [], 0, ""
    for ch in s:
        if ch in "([{<":
            depth += 1
        elif ch in ")]}>":
            depth -= 1
        if ch == sep and depth == 0:
            parts.append(cur); cur = ""
        else:
            cur += ch
    parts.append(cur)
    return parts


def decl_names(stmt):
    """Tên biến được khai báo trong câu lệnh (không có dấu ;). [] nếu không phải khai báo."""
    st = stmt.strip()
    if re.match(r"^(return|typedef|using|template|struct|class|const|constexpr|static\s+const)\b", st):
        return []
    m = TYPE_RE.match(st)
    if not m:
        return []
    rest = m.group(1).strip()
    sb = re.match(r"^\[([^\]]*)\]", rest)          # auto [x, y] = ...
    if sb:
        return [x.strip() for x in sb.group(1).split(",") if re.fullmatch(r"\w+", x.strip())]
    names = []
    for part in split_top(rest):
        p = part.strip()
        mm = re.match(r"^[&*\s]*([A-Za-z_]\w*)\s*(.*)$", p, re.S)
        if not mm:
            continue
        name, tail = mm.group(1), mm.group(2).strip()
        if name in KEYWORDS:
            return []
        if tail.startswith("(") and re.match(r"^\(\s*(?:const\s+)?(?:int|long|double|char|bool|string|vector|auto)\b", tail):
            return []                               # khai báo hàm
        if re.match(r"^=\s*\[", tail):               # lambda: không theo dõi
            continue
        names.append(name)
    return names


class Instr:
    def __init__(self, code):
        self.code = code
        self.s = strip_code(code)
        self.edits = []             # (vị trí, chuỗi chèn, thứ tự)
        self.line_starts = [0] + [m.end() for m in re.finditer(r"\n", code)]

    def line_of(self, pos):
        lo, hi = 0, len(self.line_starts) - 1
        while lo < hi:
            mid = (lo + hi + 1) // 2
            if self.line_starts[mid] <= pos:
                lo = mid
            else:
                hi = mid - 1
        return lo + 1

    def skip_ws(self, i):
        s = self.s
        while i < len(s) and s[i].isspace():
            i += 1
        return i

    def trace_call(self, pos, scopes):
        seen, names = set(), []
        for sc in reversed(scopes):
            for nm in reversed(sc):
                if nm not in seen:
                    seen.add(nm); names.append(nm)
        names = list(reversed(names[:18]))
        args = "".join(f', "{n}", {n}' for n in names)
        return f"__hsgT({self.line_of(pos)}{args}); "

    def stmt_end_simple(self, i):
        """Kết thúc câu lệnh đơn (vị trí dấu ;) bỏ qua ngoặc lồng."""
        s = self.s
        d = 0
        while i < len(s):
            c = s[i]
            if c in "([{":
                d += 1
            elif c in ")]}":
                if d == 0:
                    return i - 1
                d -= 1
            elif c == ";" and d == 0:
                return i
            i += 1
        return len(s) - 1

    def parse_block(self, i, scopes):
        """s[i] == '{'. Trả về vị trí ngay sau '}'."""
        s = self.s
        scopes.append([])
        j = i + 1
        while True:
            j = self.skip_ws(j)
            if j >= len(s) or s[j] == "}":
                break
            j = self.parse_stmt(j, scopes, wrap=False)
        scopes.pop()
        return j + 1

    def parse_stmt(self, j, scopes, wrap):
        s = self.s
        j = self.skip_ws(j)
        if j >= len(s):
            return j
        if s[j] == "{":
            return self.parse_block(j, scopes)
        if s[j] == ";":
            return j + 1
        m = re.match(r"(for|while|if|switch)\s*\(", s[j:])
        if m:
            kw = m.group(1)
            h0 = j + m.end() - 1
            h1 = match_paren(s, h0)
            header = s[h0 + 1: h1]
            sc = []
            if kw == "for":
                if re.search(r"[^:]:[^:]", header) and header.count(";") == 0:      # for (auto x : v)
                    sc = decl_names(header.split(":")[0])
                else:
                    sc = decl_names(header.split(";")[0])
            self._open(j, scopes, wrap)
            scopes.append(sc)
            k = self.parse_stmt(h1 + 1, scopes, wrap=True)
            scopes.pop()
            if kw == "if":
                k2 = self.skip_ws(k)
                me = re.match(r"else\b", s[k2:])
                if me:
                    k = self.parse_stmt(k2 + me.end(), scopes, wrap=True)
            self._close(k, wrap)
            return k
        md = re.match(r"do\b", s[j:])
        if md:
            self._open(j, scopes, wrap)
            k = self.parse_stmt(j + md.end(), scopes, wrap=True)
            k = self.skip_ws(k)
            mw = re.match(r"while\s*\(", s[k:])
            if mw:
                h1 = match_paren(s, k + mw.end() - 1)
                semi = s.find(";", h1)
                k = (semi + 1) if semi >= 0 else len(s)
            self._close(k, wrap)
            return k
        if re.match(r"else\b", s[j:]):          # else lạc (không nên xảy ra)
            return j + 4
        e = self.stmt_end_simple(j)
        stmt = s[j: e]
        names = decl_names(stmt)
        if names and wrap:
            wrap = False   # khai báo làm thân vòng lặp không bọc được -> bỏ qua ghi vết
            return e + 1
        self._open(j, scopes, wrap)
        self._close(e + 1, wrap)
        if names:
            scopes[-1].extend(names)
        return e + 1

    def _open(self, pos, scopes, wrap):
        call = self.trace_call(pos, scopes)
        self.edits.append((pos, ("{ " if wrap else "") + call, 0))

    def _close(self, pos, wrap):
        if wrap:
            self.edits.append((pos, " }", 1))

    def run(self):
        s = self.s
        globals_ = []        # (vị trí, tên)
        i, depth = 0, 0
        nfunc = 0
        while i < len(s):
            i = self.skip_ws(i)
            if i >= len(s):
                break
            mstruct = re.match(r"(struct|class|namespace|enum|union)\b[^{;]*\{", s[i:])
            if mstruct:
                b = i + mstruct.end() - 1
                i = match_paren(s, b, "{", "}") + 1
                continue
            e = i
            d = 0
            while e < len(s) and not (d == 0 and s[e] in ";{"):
                if s[e] in "([":
                    d += 1
                elif s[e] in ")]":
                    d -= 1
                e += 1
            if e >= len(s):
                break
            head = s[i:e]
            if s[e] == "{":
                mf = re.search(r"(\w+)\s*\(([^()]*(?:\([^()]*\)[^()]*)*)\)\s*(const\s*)?$", head)
                if mf and "=" not in head.split("(")[0]:
                    params = []
                    for p in split_top(mf.group(2)):
                        p = re.sub(r"=.*$", "", p).strip()
                        mm = re.search(r"([A-Za-z_]\w*)\s*(\[\s*\w*\s*\])*$", p)
                        if mm and p != mm.group(1) and mm.group(1) not in ("void",):
                            params.append(mm.group(1))
                    vis_globals = [n for (pos, n) in globals_ if pos < i]
                    scopes = [vis_globals, params]
                    end = self.parse_block(e, scopes)
                    nfunc += 1
                    i = end
                    continue
                for n in decl_names(head):               # mảng toàn cục có khởi tạo = {..}
                    globals_.append((i, n))
                i = match_paren(s, e, "{", "}") + 1
                j = s.find(";", i)
                i = (j + 1) if j >= 0 else len(s)
                continue
            for n in decl_names(head):
                globals_.append((i, n))
            i = e + 1
        out = self.code
        for pos, txt, order in sorted(self.edits, key=lambda x: (x[0], x[2]), reverse=True):
            out = out[:pos] + txt + out[pos:]
        return PRELUDE + "#line 1\n" + out


def instrument(code):
    return Instr(code).run()


def parse_trace(text):
    events, total, cut = [], None, False
    for ln in text.split("\n"):
        if ln.startswith("L\t"):
            parts = ln.split("\t")
            ev = {"line": int(parts[1]), "out": int(parts[2]), "vars": []}
            for p in parts[3:]:
                f = p.split("\x01")
                if len(f) < 3:
                    continue
                name, kind = f[0], f[1]
                if kind == "a":
                    ev["vars"].append({"n": name, "k": "a", "len": int(f[2]), "v": f[3].split("\x02") if len(f) > 3 and f[3] != "" else []})
                elif kind == "g":
                    rows = f[3].split("\x03") if len(f) > 3 and f[3] != "" else []
                    ev["vars"].append({"n": name, "k": "g", "len": int(f[2]), "v": [r.split("\x02") if r else [] for r in rows]})
                else:
                    ev["vars"].append({"n": name, "k": "s", "v": "\x01".join(f[2:])})
            events.append(ev)
        elif ln.startswith("N\t"):
            total = int(ln.split("\t")[1])
    if total is not None and total > len(events):
        cut = True
    return events, total, cut


def debug_run(code, input_text, time_limit=5.0):
    """Biên dịch code gốc (để báo lỗi đúng dòng), rồi bản có ghi vết; chạy và trả về các bước."""
    exe0, err = jc.compile_cpp(code)
    if err:
        return {"status": "CE", "compile_error": err}
    try:
        inst = instrument(code)
    except Exception as e:     # pragma: no cover
        return {"status": "ERR", "error": f"Không phân tích được code để gỡ lỗi: {e}"}
    exe, err = jc.compile_cpp(inst, tag="dbg")
    if err:
        return {"status": "ERR", "error": "Code của bạn dùng cấu trúc mà bộ gỡ lỗi chưa hỗ trợ (vẫn chạy/chấm bình thường được).",
                "detail": err[-1500:]}
    os.makedirs(jc.BUILD_DIR, exist_ok=True)
    tpath = os.path.join(jc.BUILD_DIR, f"trace_{uuid.uuid4().hex[:8]}.txt")
    env = dict(os.environ, HSG_TRACE=tpath)
    t0 = time.perf_counter()
    status, out_b = "OK", b""
    try:
        p = subprocess.run([exe], input=input_text.encode("utf-8"), capture_output=True, timeout=time_limit, env=env)
        out_b = p.stdout
        if p.returncode != 0:
            status = "RE"
    except subprocess.TimeoutExpired as e:
        status = "TLE"
        out_b = e.stdout or b""
    el = int((time.perf_counter() - t0) * 1000)
    text = ""
    if os.path.isfile(tpath):
        with open(tpath, encoding="utf-8", errors="replace") as f:
            text = f.read()
        try:
            os.remove(tpath)
        except OSError:
            pass
    events, total, cut = parse_trace(text)
    output = out_b[:200000].decode("utf-8", errors="replace")
    res = {"status": status, "events": events, "total": total, "truncated": cut or total is None,
           "output": output, "time_ms": el}
    if status == "RE":
        res["error"] = jc.explain_exit(p.returncode)
    return res
