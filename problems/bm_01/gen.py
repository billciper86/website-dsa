# -*- coding: utf-8 -*-
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from genlib import *

SEED = 3011
V = 10**9


def make(S, a):
    return build(line(len(a), S), arr_line(a))


def case(rng, n):
    hi = rng.choice([3, 10, 1000, V])
    a = rand_arr(rng, n, 1, hi)
    t = rng.random()
    if t < 0.1:
        S = 0
    elif t < 0.8:
        S = sum(x for x in a if rng.random() < 0.5)     # tổng của 1 tập con có thật
    else:
        S = rng.randint(0, min(2 * 10**10, sum(a) + 5))
    return make(S, a)


def tests(rng):
    yield 1, make(5, [1, 2, 3, 4]), "ví dụ đề bài"
    yield 1, make(0, [7]), "S=0: chỉ tập rỗng"
    yield 1, make(7, [7]), "n=1"
    yield 1, make(3, [1] * 10), "toàn 1: C(10,3)"
    yield 1, make(10 * V, [V] * 10), "tổng 1e10 (bẫy int)"
    yield 1, make(3 * V, [V] * 10), "3e9 (bẫy int)"
    for _ in range(19):
        yield 1, case(rng, rng.randint(1, 10)), "ngẫu nhiên nhỏ"
    yield 2, make(0, rand_arr(rng, 20, 1, V)), "S=0, n=20"
    yield 2, make(10, [1] * 20), "toàn 1: C(20,10)=184756"
    yield 2, make(20 * V, [V] * 20), "chọn hết, 2e10"
    yield 2, make(5 * V, [V] * 20), "C(20,5) tập, tổng 5e9 (bẫy int)"
    for i in range(42):
        yield 2, case(rng, 20 if i < 30 else rng.randint(11, 20)), "ngẫu nhiên lớn"


def validate(inp, sub):
    v = ints(inp)
    n, S = v[0], v[1]
    check(1 <= n <= (10 if sub == 1 else 20) and len(v) == n + 2, "n")
    check(0 <= S <= 2 * 10**10, "S")
    check_range(v[2:], 1, V, "a_i")
