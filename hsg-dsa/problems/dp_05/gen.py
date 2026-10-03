# -*- coding: utf-8 -*-
# Bộ sinh test bài Dãy con tăng dài nhất. Mỗi phần tử: (subtask, input, ghi chú)
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from genlib import *

SEED = 1322
NMAX = 2 * 10**5
V = 10**9


def make(a):
    return build(str(len(a)), arr_line(a))


def rand_a(rng, n):
    t = rng.random()
    if t < 0.25:
        return rand_arr(rng, n, 1, max(1, n // 3))           # nhiều số trùng (bẫy tăng ngặt)
    if t < 0.45:                                              # gần tăng dần + nhiễu
        return [i * 3 + rng.randint(-5, 5) for i in range(n)]
    if t < 0.55:
        return [V - 3 - i * 2 + rng.randint(-3, 3) for i in range(n)]
    return rand_arr(rng, n, -V, V)


def tests(rng):
    yield 1, make([5, 2, 8, 6, 3, 6, 9, 7]), "ví dụ đề bài"
    yield 1, make([4]), "n=1"
    yield 1, make([7] * 20), "toàn bằng nhau -> 1 (bẫy không giảm)"
    yield 1, make(list(range(20, 0, -1))), "giảm dần -> 1"
    yield 1, make(list(range(-10, 10))), "tăng dần -> 20"
    yield 1, make([1, 1, 2, 2, 3, 3, 4, 4, 5, 5] * 2), "cặp trùng nhau"
    for _ in range(19):
        yield 1, make(rand_a(rng, rng.randint(1, 20))), "ngẫu nhiên nhỏ"
    yield 2, make([5] * 5000), "toàn bằng nhau"
    yield 2, make(list(range(5000))), "tăng dần 5000"
    for _ in range(18):
        yield 2, make(rand_a(rng, rng.randint(1000, 5000))), "ngẫu nhiên vừa"
    yield 3, make(list(range(-NMAX // 2, NMAX // 2))), "tăng dần 2e5 (bắt O(n^2))"
    yield 3, make([V] * NMAX), "toàn bằng nhau"
    yield 3, make(list(range(V, V - NMAX, -1))), "giảm dần"
    for i in range(22):
        n = NMAX if i < 5 else rng.randint(20001, 60000)
        yield 3, make(rand_a(rng, n)), "ngẫu nhiên lớn"


def validate(inp, sub):
    v = ints(inp)
    n = v[0]
    lim = {1: 20, 2: 5000, 3: NMAX}[sub]
    check(1 <= n <= lim and len(v) == n + 1, f"n={n}")
    check_range(v[1:], -V, V, "a_i")
