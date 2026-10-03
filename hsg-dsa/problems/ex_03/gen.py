# -*- coding: utf-8 -*-
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from genlib import *

SEED = 2033
V = 10**9


def make(g):
    return build(line(len(g), len(g[0])), *[arr_line(r) for r in g])


def grid(rng, n, m, lo, hi):
    return [rand_arr(rng, m, lo, hi) for _ in range(n)]


def tests(rng):
    yield 1, make([[1, -2, 3], [4, 5, -6], [-1, 2, 7]]), "ví dụ đề bài"
    yield 1, make([[-5]]), "1 ô âm"
    yield 1, make([[7]]), "1 ô"
    yield 1, make(grid(rng, 10, 10, -V, -1)), "toàn số âm (bẫy viền 0)"
    yield 1, make(grid(rng, 1, 10, -V, V)), "1 hàng"
    yield 1, make(grid(rng, 10, 1, -V, V)), "1 cột"
    yield 1, make([[V] * 10 for _ in range(10)]), "toàn 1e9 -> 1.9e10"
    for _ in range(18):
        n, m = rng.randint(1, 10), rng.randint(1, 10)
        lo = rng.choice([-V, -10, -100])
        yield 1, make(grid(rng, n, m, lo, max(lo, rng.choice([V, 10, -1])))), "ngẫu nhiên nhỏ"
    yield 2, make([[V] * 500 for _ in range(500)]), "toàn 1e9, 500x500 (~1e12)"
    yield 2, make([[0] * 500 for _ in range(500)]), "toàn 0"
    for i in range(18):
        n = 500 if i < 3 else rng.randint(1, 150)
        m = 500 if i < 3 else rng.randint(1, 150)
        yield 2, make(grid(rng, n, m, 0, rng.choice([10, V]))), "ngẫu nhiên không âm"
    yield 3, make([[-V] * 500 for _ in range(500)]), "toàn -1e9"
    yield 3, make(grid(rng, 500, 500, -V, -1)), "toàn âm ngẫu nhiên"
    for i in range(23):
        n = 500 if i < 3 else rng.randint(1, 150)
        m = 500 if i < 3 else rng.randint(1, 150)
        lo = rng.choice([-V, -100])
        yield 3, make(grid(rng, n, m, lo, rng.choice([V, 100, -1]))), "ngẫu nhiên lớn"


def validate(inp, sub):
    v = ints(inp)
    n, m = v[0], v[1]
    lim = 10 if sub == 1 else 500
    check(1 <= n <= lim and 1 <= m <= lim and len(v) == n * m + 2, "n/m")
    check_range(v[2:], 0 if sub == 2 else -V, V, "a_ij")
