# -*- coding: utf-8 -*-
# Bộ sinh test bài Tưới cây. Mỗi phần tử: (subtask, input, ghi chú)
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from genlib import *

SEED = 603
NMAX = 2 * 10**5
V = 10**9


def make(a, ups):
    return build(line(len(a), len(ups)), arr_line(a), *[line(l, r, x) for l, r, x in ups])


def rups(rng, n, m, xmax, long_ranges=False):
    res = []
    for _ in range(m):
        if long_ranges:
            l = rng.randint(1, max(1, n // 10)); r = rng.randint(max(l, n - n // 10), n)
        else:
            l = rng.randint(1, n); r = rng.randint(l, n)
        res.append((l, r, rng.randint(1, xmax)))
    return res


def tests(rng):
    # ---- Subtask 1: n, m <= 1000
    yield 1, make([1, 2, 3, 4, 5], [(1, 3, 10), (2, 5, 1), (5, 5, 100)]), "ví dụ đề bài"
    yield 1, make([0], [(1, 1, 1)]), "n=1"
    yield 1, make([V], [(1, 1, V)] * 1000), "n=1, cộng 1000 lần 1e9"
    yield 1, make([0] * 1000, [(1000, 1000, 5)] * 3 + [(1, 1, 7)]), "chỉ cộng ở 2 đầu mút (bẫy r+1)"
    yield 1, make([V] * 1000, [(1, 1000, V)] * 1000), "giá trị cực đại"
    yield 1, make([0] * 1000, [(i, i, i) for i in range(1, 1001)]), "mỗi đoạn 1 phần tử"
    for _ in range(19):
        n = rng.randint(1, 1000); m = rng.randint(1, 1000)
        yield 1, make(rand_arr(rng, n, 0, rng.choice([10, V])), rups(rng, n, m, rng.choice([10, V]))), "ngẫu nhiên nhỏ"
    # ---- Subtask 2: a, x <= 1000
    yield 2, make([1000] * NMAX, rups(rng, NMAX, NMAX, 1000, True)), "n=m=2e5, đoạn dài -> bắt O(n*m)"
    yield 2, make([0] * NMAX, [(1, NMAX, 1000)] * 50000), "mọi lần tưới cả hàng"
    yield 2, make([0] * NMAX, [(NMAX, NMAX, 1000)] * 1000), "chỉ tưới cây cuối (r = n)"
    for i in range(17):
        n = NMAX if i < 2 else rng.randint(1, 20000)
        m = NMAX if i < 2 else rng.randint(1, 20000)
        yield 2, make(rand_arr(rng, n, 0, 1000), rups(rng, n, m, 1000, i % 2 == 0)), "ngẫu nhiên lớn, giá trị nhỏ"
    # ---- Subtask 3: đầy đủ
    yield 3, make([V] * NMAX, [(1, NMAX, V)] * NMAX), "chiều cao ~2e14 (bẫy int)"
    yield 3, make([V] * 1000, [(1, 1000, V)] * 5), "vượt 2^31 nhẹ"
    yield 3, make([0], [(1, 1, V)] * 3), "n=1, tổng 3e9"
    for i in range(22):
        n = NMAX if i < 2 else rng.randint(1, 20000)
        m = NMAX if i < 2 else rng.randint(1, 20000)
        yield 3, make(rand_arr(rng, n, 0, V), rups(rng, n, m, V, i % 3 == 0)), "ngẫu nhiên lớn"


def validate(inp, sub):
    v = ints(inp)
    n, m = v[0], v[1]
    lim = 1000 if sub == 1 else NMAX
    check(1 <= n <= lim and 1 <= m <= lim, f"n={n} m={m}")
    check(len(v) == 2 + n + 3 * m, "số lượng số sai")
    vmax = 1000 if sub == 2 else V
    check_range(v[2:2 + n], 0, vmax, "a_i")
    for i in range(m):
        l, r, x = v[2 + n + 3 * i: 5 + n + 3 * i]
        check(1 <= l <= r <= n and 1 <= x <= vmax, f"l={l} r={r} x={x}")
