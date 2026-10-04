# -*- coding: utf-8 -*-
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from genlib import *

SEED = 3033
V = 10**9


def make(d):
    return build(str(len(d)), *[arr_line(r) for r in d])


def rand_d(rng, n, hi, sym):
    d = [[0] * n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            if i != j:
                d[i][j] = rng.randint(1, hi)
    if sym:
        for i in range(n):
            for j in range(i):
                d[i][j] = d[j][i]
    return d


def points(rng, n):
    """Thành phố là điểm trên mặt phẳng -> khoảng cách Manhattan (tham lam dễ sai)."""
    p = [(rng.randint(0, 1000), rng.randint(0, 1000)) for _ in range(n)]
    return [[0 if i == j else max(1, abs(p[i][0] - p[j][0]) + abs(p[i][1] - p[j][1])) for j in range(n)] for i in range(n)]


def trap(n):
    """Đường thẳng: 0 ở giữa, tham lam đi một phía rồi phải quay ngược rất xa."""
    xs = [0] + [i for i in range(1, n // 2 + 1)] + [-(i * 3) for i in range(1, n - n // 2)]
    return [[0 if i == j else abs(xs[i] - xs[j]) for j in range(n)] for i in range(n)]


def tests(rng):
    yield 1, make([[0, 10, 15, 20], [10, 0, 35, 25], [15, 35, 0, 30], [20, 25, 30, 0]]), "ví dụ đề bài"
    yield 1, make([[0, 5], [7, 0]]), "n=2"
    yield 1, make([[0 if i == j else V for j in range(9)] for i in range(9)]), "toàn 1e9 -> 9e9"
    yield 1, make(trap(9)), "bẫy tham lam láng giềng gần nhất"
    yield 1, make([[0, 1, 100], [100, 0, 1], [1, 100, 0]]), "không đối xứng"
    for _ in range(20):
        n = rng.randint(2, 9)
        yield 1, make(points(rng, n) if rng.random() < 0.5 else rand_d(rng, n, rng.choice([10, V]), rng.random() < 0.5)), "ngẫu nhiên nhỏ"
    yield 2, make([[0 if i == j else V for j in range(16)] for i in range(16)]), "toàn 1e9, n=16"
    yield 2, make(trap(16)), "bẫy tham lam, n=16"
    yield 2, make(points(rng, 16)), "điểm trên mặt phẳng"
    for i in range(42):
        n = 16 if i < 30 else rng.randint(10, 16)
        yield 2, make(points(rng, n) if i % 2 else rand_d(rng, n, rng.choice([10, 1000, V]), i % 3 == 0)), "ngẫu nhiên lớn"


def validate(inp, sub):
    v = ints(inp)
    n = v[0]
    check(2 <= n <= (9 if sub == 1 else 16) and len(v) == n * n + 1, "n")
    for i in range(n):
        for j in range(n):
            x = v[1 + i * n + j]
            check(x == 0 if i == j else 1 <= x <= V, "d_ij")
