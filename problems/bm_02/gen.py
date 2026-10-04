# -*- coding: utf-8 -*-
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from genlib import *

SEED = 3022
V = 10**9


def make(c):
    return build(str(len(c)), *[arr_line(r) for r in c])


def mat(rng, n, hi):
    return [rand_arr(rng, n, 1, hi) for _ in range(n)]


def tests(rng):
    yield 1, make([[4, 1, 3], [2, 1, 5], [3, 2, 2]]), "ví dụ đề bài"
    yield 1, make([[7]]), "n=1"
    yield 1, make([[1, 2], [1, 100]]), "bẫy tham lam: bạn 1 lấy việc rẻ làm bạn 2 phải làm việc đắt"
    yield 1, make([[V] * 8 for _ in range(8)]), "toàn 1e9 -> 8e9"
    yield 1, make([[1 if i == j else V for j in range(8)] for i in range(8)]), "đường chéo rẻ"
    for _ in range(20):
        n = rng.randint(1, 8)
        yield 1, make(mat(rng, n, rng.choice([5, 100, V]))), "ngẫu nhiên nhỏ"
    yield 2, make([[V] * 20 for _ in range(20)]), "toàn 1e9 -> 2e10"
    yield 2, make([[1, 2] + [V] * 18] + [[1, 100] + [V] * 18] + [[V] * 18 + [1, 1] if i % 2 else [V] * 20 for i in range(18)]), "bẫy tham lam, n=20"
    yield 2, make([[(i * 7 + j * 13) % 50 + 1 for j in range(20)] for i in range(20)]), "ma trận có quy luật"
    for i in range(42):
        n = 20 if i < 30 else rng.randint(9, 20)
        yield 2, make(mat(rng, n, rng.choice([10, 1000, V]))), "ngẫu nhiên lớn"


def validate(inp, sub):
    v = ints(inp)
    n = v[0]
    check(1 <= n <= (8 if sub == 1 else 20) and len(v) == n * n + 1, "n")
    check_range(v[1:], 1, V, "c_ij")
