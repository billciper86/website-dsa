# -*- coding: utf-8 -*-
# Bộ sinh test bài Đoạn ít màu. Mỗi phần tử: (subtask, input, ghi chú)
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from genlib import *

SEED = 933
NMAX = 2 * 10**5
V = 10**9


def make(K, a):
    return build(line(len(a), K), arr_line(a))


def blocks(rng, n, colors):
    """Dãy gồm các khối màu liên tiếp -> nhiều đoạn dài, đáp án thú vị."""
    a = []
    while len(a) < n:
        a += [rng.choice(colors)] * rng.randint(1, max(1, n // 20))
    return a[:n]


def rand_case(rng, n):
    ncol = rng.choice([2, 3, 5, 20, 1000, n])
    colors = [rng.randint(1, V) for _ in range(max(1, min(ncol, n)))]
    a = blocks(rng, n, colors) if rng.random() < 0.5 else [rng.choice(colors) for _ in range(n)]
    K = rng.randint(1, min(n, max(1, ncol)))
    return make(K, a)


def tests(rng):
    yield 1, make(2, [5, 3, 5, 3, 4, 4, 4, 4, 1]), "ví dụ đề bài"
    yield 1, make(1, [7]), "n=1"
    yield 1, make(1, [V] * 2000), "1 màu duy nhất -> cả dãy"
    yield 1, make(2000, list(range(1, 2001))), "K = n, mọi màu khác nhau"
    yield 1, make(1, list(range(1, 2001))), "K=1, mọi màu khác nhau -> 1"
    yield 1, make(2, [1, 2] * 1000), "xen kẽ 2 màu"
    yield 1, make(2, [1, 2, 3] * 666), "xen kẽ 3 màu, K=2 -> 2"
    for _ in range(18):
        yield 1, rand_case(rng, rng.randint(1, 2000)), "ngẫu nhiên nhỏ"
    yield 2, make(1, list(range(1, NMAX + 1))), "K=1, mọi màu khác nhau"
    yield 2, make(NMAX, [rng.randint(1, V) for _ in range(NMAX)]), "K = n"
    yield 2, make(3, [V, V - 1, V - 2, V - 3] * (NMAX // 4)), "màu lớn tới 1e9"
    for i in range(42):
        n = NMAX if i < 4 else rng.randint(1, 20000)
        yield 2, rand_case(rng, n), "ngẫu nhiên lớn"


def validate(inp, sub):
    v = ints(inp)
    n, K = v[0], v[1]
    check(1 <= K <= n <= (2000 if sub == 1 else NMAX) and len(v) == n + 2, f"n={n} K={K}")
    check_range(v[2:], 1, V, "a_i")
