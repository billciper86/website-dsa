# -*- coding: utf-8 -*-
# Bộ sinh test bài Đếm số nguyên tố. Mỗi phần tử: (subtask, input, ghi chú)
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from genlib import *

SEED = 1022


def make(qs):
    return build(str(len(qs)), *[line(l, r) for l, r in qs])


def rq(rng, q, mx, with_one=True):
    res = []
    for _ in range(q):
        t = rng.random()
        if t < 0.15 and with_one:
            res.append((1, rng.randint(1, mx)))          # có số 1 (bẫy coi 1 là nguyên tố)
        elif t < 0.3:
            x = rng.randint(1, mx); res.append((x, x))   # đoạn 1 số
        else:
            l = rng.randint(1, mx); res.append((l, rng.randint(l, mx)))
    return res


def tests(rng):
    yield 1, make([(1, 10), (11, 20), (1, 1)]), "ví dụ đề bài"
    yield 1, make([(1, 1)]), "chỉ số 1"
    yield 1, make([(2, 2), (1, 2), (4, 4), (997, 997), (1000, 1000)]), "đoạn 1 số"
    yield 1, make([(1, 1000)] * 100), "đoạn dài nhất"
    for _ in range(21):
        yield 1, make(rq(rng, rng.randint(1, 100), 1000)), "ngẫu nhiên nhỏ"
    yield 2, make([(1, 10**6)] * 10**5), "q=1e5 đoạn dài nhất -> bắt lời giải trâu"
    yield 2, make([(999983, 999983), (999984, 10**6), (1, 2)]), "số nguyên tố lớn nhất < 1e6"
    for i in range(18):
        yield 2, make(rq(rng, 10**5 if i < 3 else rng.randint(1, 20000), 10**6)), "ngẫu nhiên vừa"
    yield 3, make([(1, 10**7)]), "r = 1e7"
    yield 3, make([(9999991, 9999991), (9999992, 10**7)]), "số nguyên tố lớn nhất < 1e7"
    yield 3, make([(1, 1), (10**7, 10**7)]), "hai đầu"
    for i in range(22):
        yield 3, make(rq(rng, 10**5 if i < 3 else rng.randint(1, 20000), 10**7)), "ngẫu nhiên lớn"


def validate(inp, sub):
    v = ints(inp)
    q = v[0]
    check(1 <= q <= (100 if sub == 1 else 10**5) and len(v) == 2 * q + 1, f"q={q}")
    mx = {1: 1000, 2: 10**6, 3: 10**7}[sub]
    for i in range(q):
        l, r = v[1 + 2 * i], v[2 + 2 * i]
        check(1 <= l <= r <= mx, f"l={l} r={r}")
