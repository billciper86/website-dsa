# -*- coding: utf-8 -*-
# Bộ sinh test bài Đếm bội số. Mỗi phần tử: (subtask, input, ghi chú)
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from genlib import *

SEED = 101
BRUTE_SUBTASKS = [1]
LIM = {1: (10, 10**6), 2: (10**5, 10**9), 3: (10**5, 10**18)}


def make(qs):
    return build(str(len(qs)), *[line(a, b, k) for a, b, k in qs])


def rand_q(rng, maxb, maxk=None):
    b = rng.randint(1, maxb)
    a = rng.randint(1, b)
    k = rng.randint(1, maxk or maxb)
    return (a, b, k)


def tests(rng):
    # ---- Subtask 1: nhỏ + biên
    yield 1, make([(1, 1, 1)]), "nhỏ nhất: a=b=k=1"
    yield 1, make([(1, 10, 3), (5, 5, 5), (7, 20, 4)]), "ví dụ đề bài"
    yield 1, make([(5, 5, 7)]), "a=b, không chia hết -> 0"
    yield 1, make([(1, 10**6, 1)]), "k=1: mọi số đều chia hết"
    yield 1, make([(1, 10**6, 10**6)]), "k=b"
    yield 1, make([(3, 100, 1000)]), "k > b -> 0"
    yield 1, make([(1, 10**6, 7), (10**6, 10**6, 2), (999999, 10**6, 3)]), "biên b=10^6"
    yield 1, make([(6, 6, 3), (1, 2, 2), (2, 2, 2)]), "a chính là bội (bẫy a-1)"
    for _ in range(17):
        yield 1, make([rand_q(rng, 10**6, rng.choice([10, 1000, 10**6])) for _ in range(rng.randint(1, 10))]), "ngẫu nhiên nhỏ"
    # ---- Subtask 2: b <= 1e9, T lớn
    yield 2, make([(1, 10**9, 1)]), "k=1, đoạn dài 1e9 -> lời giải duyệt sẽ TLE"
    yield 2, make([(1, 10**9, 1)] * 10**5), "T=1e5, đoạn dài nhất"
    yield 2, make([(10**9, 10**9, 10**9)] * 1000), "a=b=k=1e9"
    for _ in range(10):
        yield 2, make([rand_q(rng, 10**9, rng.choice([5, 1000, 10**9])) for _ in range(rng.randint(1, 2000))]), "ngẫu nhiên vừa"
    for i in range(12):
        T = 10**5 if i < 2 else 10**4
        yield 2, make([rand_q(rng, 10**9, rng.choice([3, 10**5, 10**9])) for _ in range(T)]), f"T={T} ngẫu nhiên"
    # ---- Subtask 3: tới 1e18 (bẫy dùng int)
    E = 10**18
    yield 3, make([(1, E, 1)]), "đáp án = 1e18 (int sẽ tràn)"
    yield 3, make([(1, E, E)]), "k = 1e18"
    yield 3, make([(E, E, E), (E, E, E - 1), (E - 1, E, 2)]), "giá trị cực đại"
    yield 3, make([(1, E, 3), (2, E, 999999999989)]), "k lớn"
    yield 3, make([(3000000000, 5000000000, 1000000000)]), "vượt 2^31 một chút (bẫy int)"
    yield 3, make([(2**31, 2**32, 2), (2**31 - 1, 2**31 + 1, 1)]), "quanh 2^31"
    for _ in range(12):
        yield 3, make([rand_q(rng, E, rng.choice([7, 10**9, E])) for _ in range(rng.randint(1, 1000))]), "ngẫu nhiên lớn"
    for i in range(10):
        T = 10**5 if i < 2 else 10**4
        yield 3, make([rand_q(rng, E, rng.choice([2, 10**12, E])) for _ in range(T)]), f"T={T}, giá trị tới 1e18"


def validate(inp, sub):
    v = ints(inp)
    T = v[0]
    maxT, maxb = LIM[sub]
    check(1 <= T <= maxT and len(v) == 1 + 3 * T, f"T={T}")
    for i in range(T):
        a, b, k = v[1 + 3 * i: 4 + 3 * i]
        check(1 <= a <= b <= maxb, f"a={a}, b={b}")
        check(1 <= k <= 10**18, f"k={k}")
