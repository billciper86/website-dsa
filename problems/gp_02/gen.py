# -*- coding: utf-8 -*-
# Bộ sinh test bài Mê cung. Mỗi phần tử: (subtask, input, ghi chú)
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from genlib import *

SEED = 1522


def make(g):
    return build(line(len(g), len(g[0])), *grid_lines(g))


def place(rng, g, s=None, t=None):
    n, m = len(g), len(g[0])
    cells = [(i, j) for i in range(n) for j in range(m)]
    if s is None:
        s = rng.choice(cells)
    if t is None:
        t = rng.choice([c for c in cells if c != s]) if len(cells) > 1 else s
    g[s[0]][s[1]] = "S"; g[t[0]][t[1]] = "T"
    return g


def tests(rng):
    yield 1, make([list(r) for r in ["S.#..", ".##.#", "...T.", "#.#.."]]), "ví dụ đề bài"
    yield 1, make([list("ST")]), "kề nhau -> 1"
    yield 1, make([list("S#T")]), "bị tường chặn -> -1"
    yield 1, make(place(rng, [["."] * 50 for _ in range(50)], (0, 0), (49, 49))), "lưới trống, 2 góc -> 98"
    sn = snake_grid(50, 50)
    yield 1, make(place(rng, sn, (0, 0), (49, 49) if sn[49][49] == "." else (48, 49))), "hình rắn: đường rất dài"
    open_ = [["."] * 20 for _ in range(20)]
    yield 1, make(place(rng, open_, (10, 10), (10, 11))), "đích ngay cạnh (DFS dễ đi vòng)"
    for _ in range(19):
        n, m = rng.randint(1, 50), rng.randint(2, 50)
        yield 1, make(place(rng, rand_grid(rng, n, m, rng.choice([0, 0.15, 0.3, 0.45])))), "ngẫu nhiên nhỏ"
    sn = snake_grid(1000, 1000)
    yield 2, make(place(rng, sn, (0, 0), (999, 999) if sn[999][999] == "." else (998, 999))), "hình rắn 1000x1000 (~5e5 bước)"
    yield 2, make(place(rng, [["."] * 1000 for _ in range(1000)], (0, 0), (999, 999))), "1000x1000 trống"
    big = [["."] * 1000 for _ in range(1000)]
    for i in range(1000): big[i][500] = "#"
    yield 2, make(place(rng, big, (0, 0), (999, 999))), "bức tường chia đôi -> -1"
    yield 2, make(place(rng, [["."] * 1000 for _ in range(1000)], (500, 500), (500, 501))), "đích ngay cạnh, lưới lớn"
    for i in range(41):
        n = 1000 if i < 6 else rng.randint(51, 400)
        m = 1000 if i < 6 else rng.randint(51, 400)
        yield 2, make(place(rng, rand_grid(rng, n, m, rng.choice([0.1, 0.25, 0.35, 0.42])))), "ngẫu nhiên lớn"


def validate(inp, sub):
    ls = inp.split()
    n, m = int(ls[0]), int(ls[1])
    lim = 50 if sub == 1 else 1000
    check(1 <= n <= lim and 1 <= m <= lim and n * m >= 2 and len(ls) == n + 2, f"n={n} m={m}")
    body = "".join(ls[2:])
    check(all(len(r) == m for r in ls[2:]) and set(body) <= set(".#ST"), "hàng sai")
    check(body.count("S") == 1 and body.count("T") == 1, "cần đúng 1 S và 1 T")
