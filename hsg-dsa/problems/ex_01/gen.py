# -*- coding: utf-8 -*-
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from genlib import *

SEED = 2011
NMAX = 2 * 10**5
V = 10**9


def make(k, a):
    return build(line(len(a), k), arr_line(a))


def case(rng, n, nonneg):
    k = rng.choice([1, 2, 3, 7, 1000, V, rng.randint(1, 50)])
    lo = 0 if nonneg else rng.choice([-V, -10, -k])
    hi = rng.choice([V, 10, max(1, k)])
    return make(k, rand_arr(rng, n, lo, max(lo, hi)))


def tests(rng):
    yield 1, make(3, [1, 2, -3, 3, 4]), "ví dụ đề bài"
    yield 1, make(1, [5]), "k=1, n=1"
    yield 1, make(5, [-5]), "n=1, số âm chia hết"
    yield 1, make(3, [-1, 1, -1, 1] * 250), "xen kẽ -1, 1 (bẫy mod âm)"
    yield 1, make(V, [V] * 1000), "toàn 1e9, k=1e9"
    yield 1, make(7, [-V] * 1000), "toàn -1e9"
    for _ in range(19):
        yield 1, case(rng, rng.randint(1, 1000), False), "ngẫu nhiên nhỏ"
    yield 2, make(1, [0] * NMAX), "mọi đoạn -> 2e10 (bẫy int)"
    yield 2, make(V, rand_arr(rng, NMAX, 0, V)), "k=1e9"
    for i in range(18):
        yield 2, case(rng, NMAX if i < 3 else rng.randint(1, 20000), True), "ngẫu nhiên không âm"
    yield 3, make(2, [-1] * NMAX), "toàn -1, k=2"
    yield 3, make(3, [rng.choice([-1, 1, -2, 2]) for _ in range(NMAX)]), "số âm nhỏ (bẫy mod âm)"
    for i in range(23):
        yield 3, case(rng, NMAX if i < 3 else rng.randint(1, 20000), False), "ngẫu nhiên lớn"


def validate(inp, sub):
    v = ints(inp)
    n, k = v[0], v[1]
    check(1 <= n <= (1000 if sub == 1 else NMAX) and len(v) == n + 2 and 1 <= k <= V, "n/k")
    check_range(v[2:], 0 if sub == 2 else -V, V, "a_i")
