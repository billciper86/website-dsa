# -*- coding: utf-8 -*-
# Bộ sinh test bài Tổng hình chữ nhật. Mỗi phần tử: (subtask, input, ghi chú)
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from genlib import *

SEED = 704
V = 10**9
QMAX = 10**5


def make(g, qs):
    n, m = len(g), len(g[0])
    return build(line(n, m, len(qs)), *[arr_line(r) for r in g],
                 *[line(*t) for t in qs])


def grid(rng, n, m, lo, hi):
    return [rand_arr(rng, m, lo, hi) for _ in range(n)]


def const(n, m, v):
    return [[v] * m for _ in range(n)]


def rq(rng, n, m, q, big=False):
    res = []
    for _ in range(q):
        if big:
            x1 = rng.randint(1, max(1, n // 8)); x2 = rng.randint(max(x1, n - n // 8), n)
            y1 = rng.randint(1, max(1, m // 8)); y2 = rng.randint(max(y1, m - m // 8), m)
        else:
            x1 = rng.randint(1, n); x2 = rng.randint(x1, n)
            y1 = rng.randint(1, m); y2 = rng.randint(y1, m)
        res.append((x1, y1, x2, y2))
    return res


def tests(rng):
    ex = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]
    # ---- Subtask 1: n, m <= 50, q <= 100
    yield 1, make(ex, [(1, 1, 2, 2), (2, 2, 3, 4), (3, 1, 3, 1)]), "ví dụ đề bài"
    yield 1, make([[5]], [(1, 1, 1, 1)]), "lưới 1x1"
    yield 1, make([[-V]], [(1, 1, 1, 1)] * 3), "lưới 1x1 âm"
    yield 1, make(grid(rng, 1, 50, -V, V), rq(rng, 1, 50, 100)), "chỉ 1 hàng"
    yield 1, make(grid(rng, 50, 1, -V, V), rq(rng, 50, 1, 100)), "chỉ 1 cột"
    yield 1, make(const(50, 50, V), [(1, 1, 50, 50)] * 100), "toàn 1e9, cả lưới -> 2.5e12 (bẫy int)"
    yield 1, make(grid(rng, 50, 50, -V, V), [(i, i, i, i) for i in range(1, 51)] + [(1, 1, 1, 1), (50, 50, 50, 50)]), "hình 1 ô"
    yield 1, make(const(50, 50, -1), rq(rng, 50, 50, 100)), "toàn -1"
    for _ in range(17):
        n = rng.randint(1, 50); m = rng.randint(1, 50)
        yield 1, make(grid(rng, n, m, rng.choice([-V, -5, 0]), rng.choice([5, V])), rq(rng, n, m, rng.randint(1, 100))), "ngẫu nhiên nhỏ"
    # ---- Subtask 2: 0 <= a <= 100
    yield 2, make(const(500, 500, 100), rq(rng, 500, 500, QMAX, True)), "500x500, q=1e5, hình lớn -> bắt O(q*n*m)"
    yield 2, make(const(500, 500, 0), rq(rng, 500, 500, 20000)), "toàn 0"
    yield 2, make(grid(rng, 1, 500, 0, 100), rq(rng, 1, 500, 20000)), "1 hàng dài"
    for i in range(17):
        n = 500 if i < 2 else rng.randint(1, 200)
        m = 500 if i < 2 else rng.randint(1, 200)
        q = QMAX if i < 2 else rng.randint(1, 20000)
        yield 2, make(grid(rng, n, m, 0, 100), rq(rng, n, m, q, i % 2 == 0)), "ngẫu nhiên lớn, giá trị nhỏ"
    # ---- Subtask 3: đầy đủ
    yield 3, make(const(500, 500, V), [(1, 1, 500, 500)] + rq(rng, 500, 500, QMAX - 1, True)), "tổng 2.5e14 (bẫy int)"
    yield 3, make(const(500, 500, -V), rq(rng, 500, 500, 1000, True)), "toàn -1e9"
    yield 3, make([[V if (i + j) % 2 else -V for j in range(300)] for i in range(300)], rq(rng, 300, 300, 20000)), "bàn cờ +-1e9"
    for i in range(22):
        n = 500 if i < 2 else rng.randint(1, 200)
        m = 500 if i < 2 else rng.randint(1, 200)
        q = QMAX if i < 2 else rng.randint(1, 20000)
        yield 3, make(grid(rng, n, m, -V, V), rq(rng, n, m, q, i % 3 == 0)), "ngẫu nhiên lớn"


def validate(inp, sub):
    v = ints(inp)
    n, m, q = v[0], v[1], v[2]
    if sub == 1:
        check(n <= 50 and m <= 50 and q <= 100, f"n={n} m={m} q={q}")
    check(1 <= n <= 500 and 1 <= m <= 500 and 1 <= q <= QMAX, f"n={n} m={m} q={q}")
    check(len(v) == 3 + n * m + 4 * q, "số lượng số sai")
    if sub == 2:
        check_range(v[3:3 + n * m], 0, 100, "a_ij")
    else:
        check_range(v[3:3 + n * m], -V, V, "a_ij")
    base = 3 + n * m
    for i in range(q):
        x1, y1, x2, y2 = v[base + 4 * i: base + 4 * i + 4]
        check(1 <= x1 <= x2 <= n and 1 <= y1 <= y2 <= m, f"truy vấn {x1} {y1} {x2} {y2}")
