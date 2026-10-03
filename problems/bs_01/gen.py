# -*- coding: utf-8 -*-
# Bộ sinh test bài Đếm số trong khoảng. Mỗi phần tử: (subtask, input, ghi chú)
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from genlib import *

SEED = 811
NMAX = 2 * 10**5
V = 10**9


def make(a, qs):
    return build(line(len(a), len(qs)), arr_line(a), *[line(x, y) for x, y in qs])


def rq(rng, a, q, lo, hi):
    res = []
    for _ in range(q):
        t = rng.random()
        if t < 0.3 and a:          # đầu mút trùng đúng giá trị có trong dãy (bẫy lower/upper_bound)
            x, y = sorted((rng.choice(a), rng.choice(a)))
        elif t < 0.4 and a:
            x = y = rng.choice(a)
        else:
            x, y = sorted((rng.randint(lo, hi), rng.randint(lo, hi)))
        res.append((x, y))
    return res


def tests(rng):
    yield 1, make([5, 1, 3, 3, 9, 7], [(3, 7), (4, 4), (-5, 100)]), "ví dụ đề bài"
    yield 1, make([7], [(7, 7), (6, 6), (8, 9), (-V, V)]), "n=1"
    yield 1, make([4] * 1000, [(4, 4), (3, 4), (4, 5), (5, 9), (-V, 3)] * 200), "toàn số bằng nhau"
    yield 1, make([-V] * 500 + [V] * 500, [(-V, -V), (V, V), (-V, V), (0, 0)] * 250), "giá trị cực đại"
    yield 1, make(rand_arr(rng, 1000, -V, 0), rq(rng, [], 1000, -V, 0)), "toàn số âm"
    for _ in range(20):
        n = rng.randint(1, 1000); q = rng.randint(1, 1000)
        lo, hi = rng.choice([(1, 10), (-50, 50), (-V, V)])
        a = rand_arr(rng, n, lo, hi)
        yield 1, make(a, rq(rng, a, q, lo - 2, hi + 2)), "ngẫu nhiên nhỏ"
    yield 2, make([3] * NMAX, [(3, 3)] * NMAX), "toàn số bằng nhau, n=q=2e5"
    yield 2, make(rand_arr(rng, NMAX, -V, V), [(-V, V)] * NMAX), "mọi câu hỏi phủ cả dãy -> bắt O(n*q)"
    for i in range(43):
        n = NMAX if i < 3 else rng.randint(1, 20000)
        q = NMAX if i < 3 else rng.randint(1, 20000)
        lo, hi = rng.choice([(1, 100), (-1000, 1000), (-V, V)])
        a = rand_arr(rng, n, lo, hi)
        yield 2, make(a, rq(rng, a, q, lo - 2, hi + 2)), "ngẫu nhiên lớn"


def validate(inp, sub):
    v = ints(inp)
    n, q = v[0], v[1]
    lim = 1000 if sub == 1 else NMAX
    check(1 <= n <= lim and 1 <= q <= lim and len(v) == 2 + n + 2 * q, f"n={n} q={q}")
    check_range(v[2:], -V, V, "giá trị")
    for i in range(q):
        check(v[2 + n + 2 * i] <= v[3 + n + 2 * i], "x > y")
