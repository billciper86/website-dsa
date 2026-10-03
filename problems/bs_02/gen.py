# -*- coding: utf-8 -*-
# Bộ sinh test bài Cắt gỗ. Mỗi phần tử: (subtask, input, ghi chú)
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from genlib import *

SEED = 822
NMAX = 2 * 10**5
V = 10**9


def make(k, a):
    return build(line(len(a), k), arr_line(a))


def pick_k(rng, a):
    """Chọn k sao cho đáp án 'thú vị': lấy số thanh ứng với một L ngẫu nhiên."""
    L = rng.randint(1, max(a))
    c = sum(x // L for x in a)
    t = rng.random()
    if t < 0.1:
        return sum(a) + rng.randint(1, 5)      # không thể -> 0
    if t < 0.2:
        return sum(a)                          # đáp án đúng bằng 1
    return max(1, c + rng.choice([0, 0, 1, -1]))


def tests(rng):
    yield 1, make(7, [8, 12, 5, 3]), "ví dụ đề bài"
    yield 1, make(1, [1]), "n=1, k=1"
    yield 1, make(2, [1]), "không thể -> 0"
    yield 1, make(1, [1000, 3, 999]), "k=1 -> L = max"
    yield 1, make(1000 * 1000, [1000] * 1000), "k = tổng -> L = 1"
    yield 1, make(1000, [1000] * 1000), "toàn bằng nhau"
    for _ in range(19):
        n = rng.randint(1, 1000)
        a = rand_arr(rng, n, 1, rng.choice([10, 1000]))
        yield 1, make(pick_k(rng, a), a), "ngẫu nhiên nhỏ"
    yield 2, make(NMAX * V, [V] * NMAX), "k=2e14, L=1 (bẫy int)"
    yield 2, make(NMAX * V + 1, [V] * NMAX), "không thể, tổng 2e14"
    yield 2, make(1, [V] * NMAX), "k=1 -> L = 1e9"
    yield 2, make(10**15, rand_arr(rng, 1000, 1, V)), "k = 1e15 -> 0"
    yield 2, make(3 * 10**9, [V] * 20000), "đáp án nhỏ, tổng vượt int"
    for i in range(41):
        n = NMAX if i < 4 else rng.randint(1, 20000)
        a = rand_arr(rng, n, 1, rng.choice([1000, 10**6, V]))
        yield 2, make(pick_k(rng, a), a), "ngẫu nhiên lớn"


def validate(inp, sub):
    v = ints(inp)
    n, k = v[0], v[1]
    check(1 <= n <= NMAX and len(v) == n + 2, f"n={n}")
    check(1 <= k <= 10**15, f"k={k}")
    if sub == 1:
        check(n <= 1000, "n")
        check_range(v[2:], 1, 1000, "a_i")
    else:
        check_range(v[2:], 1, V, "a_i")
