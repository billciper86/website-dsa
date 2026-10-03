# -*- coding: utf-8 -*-
# Bộ sinh test bài Cặp chia hết. Mỗi phần tử: (subtask, input, ghi chú)
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from genlib import *

SEED = 202
NMAX = 2 * 10**5


def make(k, a):
    return build(line(len(a), k), arr_line(a))


def tests(rng):
    # ---- Subtask 1: n <= 2000
    yield 1, make(3, [1, 2, 3, 4, 5]), "ví dụ đề bài"
    yield 1, make(1, [5, 7]), "n=2, k=1 (mọi cặp đều đúng)"
    yield 1, make(10, [3, 4]), "n=2, không cặp nào"
    yield 1, make(4, [2, 2, 2, 6, 10]), "k chẵn, toàn dư k/2"
    yield 1, make(5, [5] * 2000), "toàn số bằng nhau, dư 0"
    yield 1, make(10**6, [10**9] * 2000), "giá trị cực đại"
    yield 1, make(7, [10**9 - i for i in range(2000)]), "tổng 2 số > 2^31 (bẫy int)"
    for _ in range(18):
        n = rng.randint(2, 2000)
        k = rng.choice([1, 2, 3, 6, 10, 97, 1000, 10**6, rng.randint(1, 10**6)])
        yield 1, make(k, rand_arr(rng, n, 1, rng.choice([10, 10**9]))), "ngẫu nhiên nhỏ"
    # ---- Subtask 2: k = 2
    yield 2, make(2, [1, 3]), "n=2, k=2"
    yield 2, make(2, [1] * NMAX), "toàn lẻ -> C(n,2) ~ 2e10 (bẫy int)"
    yield 2, make(2, [2] * 1000), "toàn chẵn"
    yield 2, make(2, [10**9] * NMAX), "giá trị cực đại"
    for i in range(16):
        n = NMAX if i < 2 else rng.randint(2, 20000)
        yield 2, make(2, rand_arr(rng, n, 1, 10**9)), "ngẫu nhiên k=2"
    # ---- Subtask 3: đầy đủ
    yield 3, make(1, [7] * NMAX), "k=1: mọi cặp -> 19999900000"
    yield 3, make(10**6, [5 * 10**5] * NMAX), "k=1e6, toàn dư k/2"
    yield 3, make(10**6, [10**6] * 5000 + [1] * 5000), "nửa dư 0, nửa dư 1"
    yield 3, make(6, [3 + 6 * rng.randint(0, 10**8) for _ in range(20000)]), "toàn dư 3 với k=6"
    yield 3, make(10**6, [rng.choice([1, 999999]) for _ in range(30000)]), "dư r và k-r"
    yield 3, make(999983, rand_arr(rng, 20000, 1, 10**9)), "k nguyên tố lớn"
    for i in range(20):
        n = NMAX if i < 3 else rng.randint(2, 20000)
        k = rng.choice([3, 4, 1000, 10**6, rng.randint(1, 10**6), rng.randint(1, 50)])
        mx = rng.choice([k, 10**9])
        yield 3, make(k, rand_arr(rng, n, 1, mx)), "ngẫu nhiên lớn"


def validate(inp, sub):
    v = ints(inp)
    n, k = v[0], v[1]
    check(2 <= n <= NMAX and len(v) == 2 + n, f"n={n}")
    check(1 <= k <= 10**6, f"k={k}")
    if sub == 1:
        check(n <= 2000, "subtask 1 cần n<=2000")
    if sub == 2:
        check(k == 2, "subtask 2 cần k=2")
    check_range(v[2:], 1, 10**9, "a_i")
