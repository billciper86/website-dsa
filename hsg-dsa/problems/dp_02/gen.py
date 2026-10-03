# -*- coding: utf-8 -*-
# Bộ sinh test bài Đếm đường đi trên lưới. Mỗi phần tử: (subtask, input, ghi chú)
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from genlib import *

SEED = 1222


def make(g):
    return build(line(len(g), len(g[0])), *grid_lines(g))


def free_corners(g):
    g[0][0] = "."; g[-1][-1] = "."
    return g


def tests(rng):
    yield 1, make([list("...."), list(".#.."), list("....")]), "ví dụ đề bài"
    yield 1, make([["."]]), "lưới 1x1"
    yield 1, make([["#"]]), "1x1 bị chặn -> 0"
    yield 1, make([list("#...."), list("....."), list(".....")]), "ô xuất phát bị chặn -> 0"
    yield 1, make([list("....."), list("....."), list("....#")]), "ô đích bị chặn -> 0"
    yield 1, make([list("." * 10) for _ in range(10)]), "10x10 trống: C(18,9)=48620"
    yield 1, make([list("." * 10)]), "1 hàng"
    yield 1, make([list(".#"), list("#.")]), "bị chặn hoàn toàn"
    for _ in range(17):
        n, m = rng.randint(1, 10), rng.randint(1, 10)
        g = rand_grid(rng, n, m, rng.choice([0, 0.1, 0.3]))
        if rng.random() < 0.85: free_corners(g)
        yield 1, make(g), "ngẫu nhiên nhỏ"
    yield 2, make([list("." * 1000) for _ in range(1000)]), "1000x1000 trống (số đường vượt long long: cần mod)"
    big = [list("." * 1000) for _ in range(1000)]; big[0][0] = "#"
    yield 2, make(big), "1000x1000, ô xuất phát bị chặn -> 0"
    yield 2, make([list("." * 1000)]), "1 hàng dài"
    yield 2, make([["."] for _ in range(1000)]), "1 cột dài"
    yield 2, make(free_corners(rand_grid(rng, 1000, 1000, 0.5))), "nhiều vật cản (thường bằng 0)"
    for i in range(41):
        n = 1000 if i < 3 else rng.randint(1, 300)
        m = 1000 if i < 3 else rng.randint(1, 300)
        g = rand_grid(rng, n, m, rng.choice([0, 0.02, 0.1, 0.25]))
        if rng.random() < 0.9: free_corners(g)
        yield 2, make(g), "ngẫu nhiên lớn"


def validate(inp, sub):
    ls = inp.split()
    n, m = int(ls[0]), int(ls[1])
    lim = 10 if sub == 1 else 1000
    check(1 <= n <= lim and 1 <= m <= lim and len(ls) == n + 2, f"n={n} m={m}")
    for r in ls[2:]:
        check(len(r) == m and set(r) <= set(".#"), "hàng sai")
