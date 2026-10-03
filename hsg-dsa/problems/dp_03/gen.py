# -*- coding: utf-8 -*-
# Bộ sinh test bài Ếch nhảy. Mỗi phần tử: (subtask, input, ghi chú)
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from genlib import *

SEED = 1233
NMAX = 10**5
H = 10**4


def make(K, h):
    return build(line(len(h), K), arr_line(h))


def zigzag(rng, n):
    return [rng.choice([1, H]) if i % 2 else rng.randint(1, H) for i in range(n)]


def tests(rng):
    yield 1, make(3, [10, 30, 40, 50, 20]), "ví dụ đề bài"
    yield 1, make(1, [5, 9]), "n=2"
    yield 1, make(5, [7] * 15), "toàn bằng nhau -> 0"
    yield 1, make(2, [1, 2, 100, 3, 4, 200, 5, 6, 300, 7, 8, 400, 9, 10, 11]), "bẫy tham lam (bước rẻ dẫn vào ngõ đắt)"
    yield 1, make(100, rand_arr(rng, 15, 1, H)), "K > n"
    yield 1, make(1, rand_arr(rng, 15, 1, H)), "K=1: bắt buộc nhảy từng bước"
    for _ in range(19):
        n = rng.randint(2, 15)
        yield 1, make(rng.randint(1, 5), rand_arr(rng, n, 1, rng.choice([10, H])) if rng.random() < 0.6 else zigzag(rng, n)), "ngẫu nhiên nhỏ"
    yield 2, make(2, [H if i % 2 else 1 for i in range(NMAX)]), "răng cưa, K=2"
    yield 2, make(1, rand_arr(rng, NMAX, 1, H)), "K=1, n lớn"
    for i in range(18):
        n = NMAX if i < 2 else rng.randint(2, 20000)
        yield 2, make(rng.randint(1, 2), zigzag(rng, n) if i % 2 else rand_arr(rng, n, 1, H)), "ngẫu nhiên K<=2"
    yield 3, make(100, rand_arr(rng, NMAX, 1, H)), "n=1e5, K=100 -> O(n*K)=1e7"
    yield 3, make(100, [H] * NMAX), "toàn bằng nhau"
    yield 3, make(100, [1 + (i * 37) % H for i in range(NMAX)]), "răng cưa đều"
    for i in range(22):
        n = NMAX if i < 3 else rng.randint(2, 20000)
        yield 3, make(rng.randint(1, 100), zigzag(rng, n) if i % 2 else rand_arr(rng, n, 1, H)), "ngẫu nhiên lớn"


def validate(inp, sub):
    v = ints(inp)
    n, K = v[0], v[1]
    check(2 <= n <= (15 if sub == 1 else NMAX) and len(v) == n + 2, f"n={n}")
    check(1 <= K <= (2 if sub == 2 else 100), f"K={K}")
    check_range(v[2:], 1, H, "h_i")
