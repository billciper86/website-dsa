# -*- coding: utf-8 -*-
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from genlib import *

SEED = 2022
NMAX = 2 * 10**5
V = 10**9


def make(c, x):
    return build(line(len(x), c), arr_line(x))


def case(rng, n, mx):
    x = rng.sample(range(0, mx + 1), n)
    return make(rng.randint(2, n), x)


def tests(rng):
    yield 1, make(3, [1, 2, 8, 4, 9]), "ví dụ đề bài"
    yield 1, make(2, [0, 1000]), "2 chuồng ở 2 đầu"
    yield 1, make(1000, list(range(1000, 0, -1))), "c = n, giảm dần (bẫy không sort)"
    yield 1, make(2, [5, 3]), "n=2, chưa sắp xếp"
    yield 1, make(3, [1000, 0, 500, 1, 999]), "chưa sắp xếp"
    for _ in range(20):
        n = rng.randint(2, 1000)
        yield 1, case(rng, n, rng.choice([max(n, 50), 1000])), "ngẫu nhiên nhỏ"
    yield 2, make(2, [0, V]), "đáp án 1e9"
    yield 2, make(NMAX, rng.sample(range(V + 1), NMAX)), "c = n"
    yield 2, make(2, rng.sample(range(V + 1), NMAX)), "c = 2"
    yield 2, make(NMAX // 2, list(range(V, V - NMAX, -1))), "giảm dần liên tiếp"
    for i in range(41):
        n = NMAX if i < 4 else rng.randint(2, 20000)
        yield 2, case(rng, n, rng.choice([V, n * 3, 10**6])), "ngẫu nhiên lớn"


def validate(inp, sub):
    v = ints(inp)
    n, c = v[0], v[1]
    check(2 <= c <= n <= (1000 if sub == 1 else NMAX) and len(v) == n + 2, "n/c")
    check_range(v[2:], 0, 1000 if sub == 1 else V, "x_i")
    check(len(set(v[2:])) == n, "tọa độ trùng")
