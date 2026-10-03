# -*- coding: utf-8 -*-
# Bộ sinh test bài Xếp hàng. Mỗi phần tử: (subtask, input, ghi chú)
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from genlib import *

SEED = 1122
NMAX = 2 * 10**5


def make(t):
    return build(str(len(t)), arr_line(t))


def tests(rng):
    yield 1, make([5, 1, 3]), "ví dụ đề bài"
    yield 1, make([7]), "n=1"
    yield 1, make([4] * 8), "toàn bằng nhau"
    yield 1, make([8, 7, 6, 5, 4, 3, 2, 1]), "giảm dần"
    yield 1, make([10**6] * 8), "giá trị cực đại"
    for _ in range(20):
        yield 1, make(rand_arr(rng, rng.randint(2, 8), 1, rng.choice([10, 10**6]))), "ngẫu nhiên nhỏ"
    yield 2, make([1000] * 1000), "toàn 1000, tổng 5e8 (vẫn vừa int)"
    yield 2, make(list(range(1000, 0, -1))), "giảm dần"
    for _ in range(18):
        yield 2, make(rand_arr(rng, rng.randint(1, 1000), 1, 1000)), "ngẫu nhiên vừa"
    yield 3, make([10**6] * NMAX), "tổng ~2e16 (bẫy int)"
    yield 3, make([1] * NMAX), "toàn 1"
    yield 3, make(list(range(NMAX, 0, -1))), "giảm dần, n lớn"
    for i in range(22):
        n = NMAX if i < 4 else rng.randint(1, 20000)
        yield 3, make(rand_arr(rng, n, 1, rng.choice([10, 1000, 10**6]))), "ngẫu nhiên lớn"


def validate(inp, sub):
    v = ints(inp)
    n = v[0]
    lim = {1: 8, 2: 1000, 3: NMAX}[sub]
    check(1 <= n <= lim and len(v) == n + 1, f"n={n}")
    check_range(v[1:], 1, 1000 if sub == 2 else 10**6, "t_i")
