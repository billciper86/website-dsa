# -*- coding: utf-8 -*-
# Bộ sinh test bài Cái túi. Mỗi phần tử: (subtask, input, ghi chú)
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from genlib import *

SEED = 1311
V = 10**9
WMAX = 10**5


def make(W, items):
    return build(line(len(items), W), *[line(w, v) for w, v in items])


def rand_items(rng, n, wmax, vmax, corr=False):
    res = []
    for _ in range(n):
        w = rng.randint(1, wmax)
        v = max(1, min(vmax, w * rng.randint(90, 110) // 100 * (vmax // max(1, wmax)) if corr else rng.randint(1, vmax)))
        res.append((w, v))
    return res


def tests(rng):
    yield 1, make(8, [(3, 30), (4, 50), (5, 60)]), "ví dụ đề bài"
    yield 1, make(5, [(6, 100)]), "món duy nhất quá nặng -> 0"
    yield 1, make(10, [(10, 7)]), "vừa khít"
    yield 1, make(10, [(6, 30), (5, 20), (5, 20)]), "bẫy tham lam theo tỉ lệ"
    yield 1, make(10, [(1, 1), (10, 9)]), "bẫy lấy 1 món nhiều lần"
    yield 1, make(WMAX, [(5000, V)] * 20), "tổng giá trị 2e10 (bẫy int)"
    for _ in range(19):
        n = rng.randint(1, 20)
        W = rng.choice([10, 100, 1000, WMAX])
        yield 1, make(W, rand_items(rng, n, rng.choice([W // 2 + 1, W]), rng.choice([100, V]), rng.random() < 0.4)), "ngẫu nhiên nhỏ"
    yield 2, make(WMAX, [(1000, V)] * 100), "lấy được 100 món, tổng 1e11"
    yield 2, make(WMAX, [(WMAX, V)] * 100), "chỉ lấy được 1 món"
    yield 2, make(WMAX, [(rng.randint(WMAX // 3, WMAX // 2), V - i) for i in range(100)]), "chỉ lấy được 2 món"
    for i in range(43):
        W = WMAX if i < 25 else rng.randint(1, WMAX)
        n = 100 if i < 25 else rng.randint(21, 100)
        yield 2, make(W, rand_items(rng, n, rng.choice([W // 10 + 1, W // 2 + 1, W]), rng.choice([1000, V]), i % 3 == 0)), "ngẫu nhiên lớn"


def validate(inp, sub):
    v = ints(inp)
    n, W = v[0], v[1]
    check(1 <= n <= (20 if sub == 1 else 100) and len(v) == 2 * n + 2, f"n={n}")
    check(1 <= W <= WMAX, "W")
    for i in range(n):
        check(1 <= v[2 + 2 * i] <= WMAX and 1 <= v[3 + 2 * i] <= V, "w/v")
