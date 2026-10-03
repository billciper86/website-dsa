# -*- coding: utf-8 -*-
"""Hàm tiện ích dùng chung cho các bộ sinh test gen.py."""


def line(*xs):
    return " ".join(str(x) for x in xs)


def arr_line(a):
    return " ".join(map(str, a))


def rand_arr(rng, n, lo, hi):
    return [rng.randint(lo, hi) for _ in range(n)]


def build(*lines):
    return "\n".join(lines) + "\n"


def ints(s):
    return list(map(int, s.split()))


def check(cond, msg):
    if not cond:
        raise AssertionError("Test sai giới hạn: " + msg)


def rand_str(rng, n, alphabet="abcdefghijklmnopqrstuvwxyz"):
    return "".join(rng.choice(alphabet) for _ in range(n))


def rand_grid(rng, n, m, wall_prob, wall="#", free="."):
    return [[wall if rng.random() < wall_prob else free for _ in range(m)] for _ in range(n)]


def grid_lines(g):
    return ["".join(r) for r in g]


def snake_grid(n, m):
    """Mê cung hình rắn: đường đi dài nhất có thể (bẫy lời giải chậm / đệ quy sâu)."""
    g = [["." for _ in range(m)] for _ in range(n)]
    for i in range(1, n, 2):
        for j in range(m):
            g[i][j] = "#"
        g[i][m - 1 if (i // 2) % 2 == 0 else 0] = "."
    return g


def check_range(xs, lo, hi, name):
    for x in xs:
        if not (lo <= x <= hi):
            raise AssertionError(f"Test sai giới hạn: {name}={x} nằm ngoài [{lo}, {hi}]")
