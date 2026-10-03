# -*- coding: utf-8 -*-
# Bộ sinh test bài Đoạn dài nhất có tổng <= S. Mỗi phần tử: (subtask, input, ghi chú)
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from genlib import *

SEED = 911
NMAX = 2 * 10**5
V = 10**9


def make(S, a):
    return build(line(len(a), S), arr_line(a))


def rand_case(rng, n):
    hi = rng.choice([3, 100, V])
    a = rand_arr(rng, n, 1, hi)
    L = rng.randint(1, n)
    l = rng.randint(0, n - L)
    S = max(1, sum(a[l:l + L]) + rng.choice([0, 0, -1, 1]))
    return make(S, a)


def tests(rng):
    yield 1, make(10, [4, 2, 1, 3, 6, 1, 1]), "ví dụ đề bài"
    yield 1, make(5, [5]), "n=1, đúng bằng S"
    yield 1, make(4, [5]), "n=1, không có đoạn -> 0"
    yield 1, make(1, [2] * 5000), "mọi số > S -> 0"
    yield 1, make(10**15, [V] * 5000), "S rất lớn -> cả dãy (tổng 5e12, bẫy int)"
    yield 1, make(3 * V, [V] * 5000), "S = 3e9 (bẫy int)"
    yield 1, make(7, [1] * 5000), "toàn 1"
    for _ in range(18):
        yield 1, rand_case(rng, rng.randint(1, 5000)), "ngẫu nhiên nhỏ"
    yield 2, make(10**15, [V] * NMAX), "cả dãy, tổng 2e14"
    yield 2, make(NMAX // 2, [1] * NMAX), "toàn 1, nửa dãy"
    yield 2, make(V, [V] * NMAX), "mỗi đoạn chỉ 1 phần tử"
    yield 2, make(V - 1, [V] * NMAX), "không có đoạn -> 0"
    for i in range(42):
        n = NMAX if i < 4 else rng.randint(1, 20000)
        yield 2, rand_case(rng, n), "ngẫu nhiên lớn"


def validate(inp, sub):
    v = ints(inp)
    n, S = v[0], v[1]
    check(1 <= n <= (5000 if sub == 1 else NMAX) and len(v) == n + 2, f"n={n}")
    check(1 <= S <= 10**15, "S")
    check_range(v[2:], 1, V, "a_i")
