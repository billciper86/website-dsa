# -*- coding: utf-8 -*-
# Bộ sinh test bài Lịch họp. Mỗi phần tử: (subtask, input, ghi chú)
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from genlib import *

SEED = 1111
NMAX = 2 * 10**5
V = 10**9


def make(ms):
    return build(str(len(ms)), *[line(s, e) for s, e in ms])


def rand_meet(rng, n, T, maxlen):
    res = []
    for _ in range(n):
        s = rng.randint(0, T - 1)
        e = min(T, s + rng.randint(1, maxlen))
        res.append((s, e))
    return res


def chain(rng, n, T):
    """Các cuộc họp nối đuôi nhau (kết thúc = bắt đầu của cuộc sau) + nhiễu."""
    pts = sorted(rng.sample(range(0, T + 1), n + 1))
    res = [(pts[i], pts[i + 1]) for i in range(n)]
    rng.shuffle(res)
    return res


def tests(rng):
    yield 1, make([(1, 4), (3, 5), (0, 6), (5, 7), (8, 9)]), "ví dụ đề bài"
    yield 1, make([(0, 1)]), "n=1"
    yield 1, make([(0, 10), (1, 2), (3, 4), (5, 6)]), "phản ví dụ cho sắp theo giờ bắt đầu"
    yield 1, make([(1, 3), (3, 5), (5, 7), (7, 9)]), "nối đuôi đúng lúc (bẫy dấu >)"
    yield 1, make([(0, 5), (4, 6), (5, 10)]), "phản ví dụ cho sắp theo độ dài"
    yield 1, make([(2, 3)] * 15), "toàn bộ trùng nhau"
    yield 1, make(chain(rng, 15, 100)), "15 cuộc nối đuôi"
    for _ in range(18):
        n = rng.randint(1, 15)
        T = rng.choice([20, 100, V])
        yield 1, make(rand_meet(rng, n, T, rng.choice([3, T // 3, T]))), "ngẫu nhiên nhỏ"
    yield 2, make(chain(rng, NMAX, V)), "2e5 cuộc nối đuôi"
    yield 2, make([(0, V)] * NMAX), "toàn bộ trùng nhau"
    yield 2, make([(0, V)] + [(i, i + 1) for i in range(0, 2 * 10**5 - 1)]), "1 cuộc dài + nhiều cuộc ngắn"
    for i in range(42):
        n = NMAX if i < 4 else rng.randint(1, 20000)
        T = rng.choice([1000, 10**6, V])
        if i % 4 == 0:
            ms = chain(rng, min(n, T), T) + rand_meet(rng, max(0, n - min(n, T)), T, T // 10)
            ms = ms[:n]
        else:
            ms = rand_meet(rng, n, T, rng.choice([5, T // 100 + 1, T]))
        yield 2, make(ms), "ngẫu nhiên lớn"


def validate(inp, sub):
    v = ints(inp)
    n = v[0]
    check(1 <= n <= (15 if sub == 1 else NMAX) and len(v) == 2 * n + 1, f"n={n}")
    for i in range(n):
        s, e = v[1 + 2 * i], v[2 + 2 * i]
        check(0 <= s < e <= V, f"s={s} e={e}")
