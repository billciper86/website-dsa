# -*- coding: utf-8 -*-
# Bộ sinh test bài Tổng đoạn. Mỗi phần tử: (subtask, input, ghi chú)
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from genlib import *

SEED = 401
NMAX = 2 * 10**5
V = 10**9


def make(a, qs):
    return build(line(len(a), len(qs)), arr_line(a), *[line(l, r) for l, r in qs])


def rq(rng, n, q, long_ranges=False):
    res = []
    for _ in range(q):
        if long_ranges:
            l = rng.randint(1, max(1, n // 10)); r = rng.randint(max(l, n - n // 10), n)
        else:
            l = rng.randint(1, n); r = rng.randint(l, n)
        res.append((l, r))
    return res


def tests(rng):
    # ---- Subtask 1: n, q <= 1000
    yield 1, make([1, -2, 3, 4, 5], [(1, 3), (2, 5), (4, 4)]), "ví dụ đề bài"
    yield 1, make([7], [(1, 1)]), "n=1"
    yield 1, make([-5], [(1, 1)] * 3), "n=1, số âm"
    yield 1, make([-V] * 1000, rq(rng, 1000, 1000)), "toàn số âm cực tiểu"
    yield 1, make([V] * 1000, [(1, 1000)] * 1000), "toàn 1e9, đoạn dài nhất"
    yield 1, make([3] * 1000, rq(rng, 1000, 1000)), "toàn số bằng nhau"
    yield 1, make(rand_arr(rng, 1000, -V, V), [(1, 1), (1000, 1000), (1, 1000), (2, 999)] + [(i, i) for i in range(1, 997)]), "đoạn 1 phần tử (bẫy lệch chỉ số)"
    for _ in range(18):
        n = rng.randint(1, 1000); q = rng.randint(1, 1000)
        yield 1, make(rand_arr(rng, n, rng.choice([-V, -10, 0]), rng.choice([10, V])), rq(rng, n, q)), "ngẫu nhiên nhỏ"
    # ---- Subtask 2: 0 <= a_i <= 1000
    yield 2, make([0] * 50000, rq(rng, 50000, 50000)), "toàn 0"
    yield 2, make([1000] * NMAX, rq(rng, NMAX, NMAX, True)), "toàn 1000, đoạn dài -> bắt O(n*q)"
    yield 2, make(rand_arr(rng, NMAX, 0, 1000), [(1, NMAX)] * 50000), "mọi câu hỏi là cả dãy"
    for i in range(17):
        n = NMAX if i < 2 else rng.randint(1, 20000)
        q = NMAX if i < 2 else rng.randint(1, 20000)
        yield 2, make(rand_arr(rng, n, 0, 1000), rq(rng, n, q, i % 2 == 0)), "ngẫu nhiên lớn, giá trị nhỏ"
    # ---- Subtask 3: đầy đủ
    yield 3, make([V] * NMAX, [(1, NMAX)] + rq(rng, NMAX, NMAX - 1, True)), "tổng 2e14 (bẫy int)"
    yield 3, make([-V] * NMAX, rq(rng, NMAX, 1000, True)), "toàn -1e9"
    yield 3, make([V if i % 2 else -V for i in range(50000)], rq(rng, 50000, 50000)), "xen kẽ +-1e9"
    yield 3, make([V] * 25000 + [-V] * 25000, rq(rng, 50000, 50000)), "nửa dương nửa âm"
    yield 3, make([7], [(1, 1)]), "n=1"
    for i in range(22):
        n = NMAX if i < 1 else rng.randint(1, 20000)
        q = NMAX if i < 1 else rng.randint(1, 20000)
        yield 3, make(rand_arr(rng, n, -V, V), rq(rng, n, q, i % 3 == 0)), "ngẫu nhiên lớn"


def validate(inp, sub):
    v = ints(inp)
    n, q = v[0], v[1]
    lim = 1000 if sub == 1 else NMAX
    check(1 <= n <= lim and 1 <= q <= lim, f"n={n} q={q}")
    check(len(v) == 2 + n + 2 * q, "số lượng số sai")
    a = v[2:2 + n]
    if sub == 2:
        check_range(a, 0, 1000, "a_i")
    else:
        check_range(a, -V, V, "a_i")
    for i in range(q):
        l, r = v[2 + n + 2 * i], v[3 + n + 2 * i]
        check(1 <= l <= r <= n, f"l={l} r={r}")
