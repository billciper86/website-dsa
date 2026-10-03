# -*- coding: utf-8 -*-
# Bộ sinh test bài Đếm ước. Mỗi phần tử: (subtask, input, ghi chú)
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from genlib import *

SEED = 303
E12 = 10**12


def make(ns):
    return build(str(len(ns)), *map(str, ns))


def tests(rng):
    # ---- Subtask 1: n <= 1e6
    yield 1, make([1, 12, 36]), "ví dụ đề bài"
    yield 1, make([1]), "n=1"
    yield 1, make([2, 3, 4]), "số rất nhỏ"
    yield 1, make([10**6, 999999, 999983]), "biên 1e6, số nguyên tố lớn"
    yield 1, make([720720, 831600, 942480, 982800, 997920]), "nhiều ước (240 ước)"
    yield 1, make([i * i for i in (1, 2, 3, 10, 100, 1000)]), "số chính phương (bẫy đếm 2 lần)"
    yield 1, make([10**6] * 20), "T=20, n=1e6"
    for _ in range(27):
        T = rng.randint(1, 20)
        yield 1, make([rng.choice([rng.randint(1, 10**6), rng.randint(1, 1000) ** 2, rng.randint(1, 100)]) for _ in range(T)]), "ngẫu nhiên nhỏ"
    # ---- Subtask 2: n <= 1e12
    yield 2, make([E12]), "n=1e12 (chính phương: 10^6 * 10^6)"
    yield 2, make([999999999989]), "số nguyên tố lớn nhất < 1e12"
    yield 2, make([999998000001]), "(10^6-1)^2 chính phương"
    yield 2, make([963761198400]), "6720 ước"
    yield 2, make([2**39, 3**25, 5**17]), "lũy thừa"
    yield 2, make([999999999989] * 20), "T=20 số nguyên tố lớn -> bắt lời giải chậm"
    yield 2, make([E12] * 20), "T=20, n=1e12"
    yield 2, make([2147483647, 2147483648, 4294967296, 46341 * 46341]), "quanh 2^31 (bẫy int)"
    for _ in range(20):
        T = rng.randint(1, 20)
        yield 2, make([rng.choice([rng.randint(1, E12), rng.randint(1, 10**6) ** 2, rng.randint(E12 // 2, E12)]) for _ in range(T)]), "ngẫu nhiên lớn"
    for _ in range(10):
        yield 2, make([rng.randint(E12 - 10**6, E12) for _ in range(20)]), "T=20 sát 1e12"


def validate(inp, sub):
    v = ints(inp)
    T = v[0]
    check(1 <= T <= 20 and len(v) == T + 1, f"T={T}")
    check_range(v[1:], 1, 10**6 if sub == 1 else E12, "n")
