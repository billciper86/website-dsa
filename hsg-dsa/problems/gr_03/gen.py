# -*- coding: utf-8 -*-
# Bộ sinh test bài Thuyền cứu hộ. Mỗi phần tử: (subtask, input, ghi chú)
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from genlib import *

SEED = 1133
NMAX = 2 * 10**5
V = 10**9


def make(C, w):
    return build(line(len(w), C), arr_line(w))


def rand_case(rng, n):
    C = rng.choice([10, 100, V, rng.randint(2, V)])
    lo = rng.choice([1, C // 3 + 1, 1])
    w = rand_arr(rng, n, max(1, min(lo, C)), C)
    return make(C, w)


def tests(rng):
    yield 1, make(10, [7, 2, 5, 3, 8]), "ví dụ đề bài"
    yield 1, make(5, [5]), "n=1"
    yield 1, make(10, [1, 2, 8, 9]), "phản ví dụ ghép cạnh nhau: (1,9),(2,8) -> 2"
    yield 1, make(10, [6] * 12), "không ai ghép được"
    yield 1, make(10, [5] * 12), "ghép vừa khít C"
    yield 1, make(V, [V] * 3 + [1] * 3), "giá trị cực đại"
    for _ in range(19):
        yield 1, rand_case(rng, rng.randint(1, 12)), "ngẫu nhiên nhỏ"
    yield 2, make(V, [V // 2] * NMAX), "mọi người ghép vừa khít"
    yield 2, make(V, [V // 2 + 1] * NMAX), "không ai ghép được"
    yield 2, make(10, [1, 2, 8, 9] * (NMAX // 4)), "phản ví dụ ghép cạnh nhau, n lớn"
    yield 2, make(V, [rng.randint(1, V) for _ in range(NMAX)]), "ngẫu nhiên n lớn"
    for i in range(42):
        n = NMAX if i < 3 else rng.randint(1, 20000)
        yield 2, rand_case(rng, n), "ngẫu nhiên lớn"


def validate(inp, sub):
    v = ints(inp)
    n, C = v[0], v[1]
    check(1 <= n <= (12 if sub == 1 else NMAX) and len(v) == n + 2, f"n={n}")
    check(1 <= C <= V, "C")
    check_range(v[2:], 1, C, "w_i")
