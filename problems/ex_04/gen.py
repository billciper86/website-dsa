# -*- coding: utf-8 -*-
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from genlib import *

SEED = 2044


def make(g):
    return build(line(len(g), len(g[0])), *grid_lines(g))


def fires(rng, g, k):
    n, m = len(g), len(g[0])
    for _ in range(k):
        g[rng.randrange(n)][rng.randrange(m)] = "F"
    return g


def tests(rng):
    yield 1, make([list("F..#"), list(".#.."), list("...F")]), "ví dụ đề bài"
    yield 1, make([["F"]]), "1 ô lửa -> 0"
    yield 1, make([list("F#.")]), "cỏ bị đá chặn -> -1"
    yield 1, make([list("F##"), list("###")]), "không có cỏ -> 0"
    yield 1, make([list("F" + "." * 48 + "F")]), "2 nguồn ở 2 đầu (bẫy 1 nguồn)"
    sn = snake_grid(50, 50); sn[0][0] = "F"
    yield 1, make(sn), "hình rắn: lan rất lâu"
    for _ in range(19):
        n, m = rng.randint(1, 50), rng.randint(1, 50)
        yield 1, make(fires(rng, rand_grid(rng, n, m, rng.choice([0, 0.1, 0.3, 0.45])), rng.choice([1, 2, 5, 20]))), "ngẫu nhiên nhỏ"
    sn = snake_grid(1000, 1000); sn[0][0] = "F"
    yield 2, make(sn), "hình rắn 1000x1000 (~5e5 phút, bắt mô phỏng từng phút)"
    big = [["."] * 1000 for _ in range(1000)]; big[0][0] = "F"; big[999][999] = "F"
    yield 2, make(big), "2 góc cháy"
    big = [["."] * 1000 for _ in range(1000)]; big[500][500] = "F"; big[998][0] = "#"; big[999][1] = "#"
    yield 2, make(big), "1 ô cỏ ở góc bị đá vây -> -1"
    for i in range(42):
        n = 1000 if i < 6 else rng.randint(51, 400)
        m = 1000 if i < 6 else rng.randint(51, 400)
        yield 2, make(fires(rng, rand_grid(rng, n, m, rng.choice([0, 0.1, 0.3, 0.4])), rng.choice([1, 3, 50, 1000]))), "ngẫu nhiên lớn"


def validate(inp, sub):
    ls = inp.split()
    n, m = int(ls[0]), int(ls[1])
    lim = 50 if sub == 1 else 1000
    check(1 <= n <= lim and 1 <= m <= lim and len(ls) == n + 2, "n/m")
    body = "".join(ls[2:])
    check(all(len(r) == m for r in ls[2:]) and set(body) <= set("F.#") and "F" in body, "lưới sai")
