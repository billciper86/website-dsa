# -*- coding: utf-8 -*-
# Bộ sinh test bài Đếm đoạn có tổng K. Mỗi phần tử: (subtask, input, ghi chú)
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from genlib import *

SEED = 502
NMAX = 2 * 10**5
V = 10**9


def make(K, a):
    return build(line(len(a), K), arr_line(a))


def seg_sum(rng, a):
    """Chọn K là tổng một đoạn ngẫu nhiên -> chắc chắn đáp án >= 1."""
    l = rng.randrange(len(a)); r = rng.randrange(l, min(len(a), l + rng.choice([3, 50, len(a)])))
    return sum(a[l:r + 1])


def rand_case(rng, n, positive=False):
    if positive:
        lo, hi = 1, rng.choice([3, 100, V])
    else:
        lo, hi = rng.choice([(-2, 2), (-100, 100), (-V, V), (-1, 1)])
    a = rand_arr(rng, n, lo, hi)
    K = seg_sum(rng, a) if rng.random() < 0.85 else rng.randint(1 if positive else -10, 10)
    return make(K, a)


def tests(rng):
    # ---- Subtask 1: n <= 300
    yield 1, make(3, [1, 2, 0, 3, -3]), "ví dụ đề bài"
    yield 1, make(5, [5]), "n=1, đúng bằng K"
    yield 1, make(4, [5]), "n=1, không có đoạn nào"
    yield 1, make(-7, [-7]), "n=1, K âm"
    yield 1, make(0, [0] * 300), "toàn 0, K=0 -> mọi đoạn"
    yield 1, make(-V, [-V] * 300), "toàn -1e9"
    yield 1, make(0, [1, -1] * 150), "xen kẽ 1,-1 với K=0"
    for _ in range(16):
        yield 1, rand_case(rng, rng.randint(1, 300)), "ngẫu nhiên nhỏ"
    # ---- Subtask 2: n <= 5000
    yield 2, make(0, [0] * 5000), "toàn 0, n=5000"
    yield 2, make(10**12, [V] * 5000), "K lớn không đạt được"
    yield 2, make(2 * V, [V] * 5000), "toàn 1e9, K=2e9 (bẫy int)"
    for _ in range(15):
        yield 2, rand_case(rng, rng.randint(1000, 5000)), "ngẫu nhiên vừa"
    # ---- Subtask 3: a_i >= 1
    yield 3, make(1, [1] * NMAX), "toàn 1, K=1"
    yield 3, make(200000 * V, [V] * NMAX), "K = tổng cả dãy (2e14)"
    yield 3, make(10**15, [V] * 1000), "K lớn nhất"
    for i in range(14):
        n = NMAX if i < 2 else rng.randint(1, 20000)
        yield 3, rand_case(rng, n, positive=True), "ngẫu nhiên số dương"
    # ---- Subtask 4: đầy đủ
    yield 4, make(0, [0] * NMAX), "toàn 0, K=0 -> ~2e10 đoạn (bẫy int)"
    yield 4, make(0, [1, -1] * (NMAX // 2)), "xen kẽ 1,-1, K=0 -> ~1e10"
    yield 4, make(-V, [-V] * NMAX), "toàn -1e9"
    yield 4, make(-10**15, rand_arr(rng, 1000, -V, V)), "K nhỏ nhất"
    for i in range(18):
        n = NMAX if i < 3 else rng.randint(1, 20000)
        yield 4, rand_case(rng, n), "ngẫu nhiên lớn"


def validate(inp, sub):
    v = ints(inp)
    n, K = v[0], v[1]
    lim = {1: 300, 2: 5000}.get(sub, NMAX)
    check(1 <= n <= lim and len(v) == n + 2, f"n={n}")
    check(abs(K) <= 10**15, f"K={K}")
    if sub == 3:
        check(K >= 1, "subtask 3 cần K>=1")
        check_range(v[2:], 1, V, "a_i")
    else:
        check_range(v[2:], -V, V, "a_i")
