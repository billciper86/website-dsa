#include <bits/stdc++.h>
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
#line 1
// Đếm số trong khoảng - Lời giải TRÂU O(n*q): qua subtask 1
// KY_VONG: 40
#include <bits/stdc++.h>
using namespace std;
int main() {
    __hsgT(6); int n, q; __hsgT(6, "n", n, "q", q); cin >> n >> q;
    __hsgT(7, "n", n, "q", q); vector<long long> a(n);
    __hsgT(8, "n", n, "q", q, "a", a); for (auto &x : a) { __hsgT(8, "n", n, "q", q, "a", a, "x", x); cin >> x; }
    __hsgT(9, "n", n, "q", q, "a", a); while (q--) {
        __hsgT(10, "n", n, "q", q, "a", a); long long x, y; __hsgT(10, "n", n, "q", q, "a", a, "x", x, "y", y); cin >> x >> y;
        __hsgT(11, "n", n, "q", q, "a", a, "x", x, "y", y); int cnt = 0;
        __hsgT(12, "n", n, "q", q, "a", a, "x", x, "y", y, "cnt", cnt); for (int i = 0; i < n; i++)
            { __hsgT(13, "n", n, "q", q, "a", a, "x", x, "y", y, "cnt", cnt, "i", i); if (x <= a[i] && a[i] <= y) { __hsgT(13, "n", n, "q", q, "a", a, "x", x, "y", y, "cnt", cnt, "i", i); cnt++; } }
        __hsgT(14, "n", n, "q", q, "a", a, "x", x, "y", y, "cnt", cnt); cout << cnt << '\n';
    }
}
