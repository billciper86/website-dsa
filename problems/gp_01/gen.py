# -*- coding: utf-8 -*-
# Bộ sinh test bài Đếm vùng. Mỗi phần tử: (subtask, input, ghi chú)
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from genlib import *

SEED = 1511


def make(g):
    return build(line(len(g), len(g[0])), *grid_lines(g))


def checker(n, m):
    """Bàn cờ: các ô '.' chỉ chạm nhau ở góc -> mỗi ô là 1 vùng (bẫy 8 hướng)."""
    return [["." if (i + j) % 2 == 0 else "#" for j in range(m)] for i in range(n)]


def tests(rng):
    yield 1, make([list(r) for r in ["..#..", ".##..", "#..#.", "..#.#"]]), "ví dụ đề bài"
    yield 1, make([["."]]), "1 ô trống"
    yield 1, make([["#"]]), "1 ô núi -> 0"
    yield 1, make([["#"] * 50 for _ in range(50)]), "toàn núi -> 0"
    yield 1, make([["."] * 50 for _ in range(50)]), "toàn trống -> 1"
    yield 1, make(checker(50, 50)), "bàn cờ: chỉ chạm góc (bẫy 8 hướng)"
    yield 1, make(snake_grid(50, 50)), "hình rắn: 1 vùng rất dài"
    for _ in range(18):
        n, m = rng.randint(1, 50), rng.randint(1, 50)
        yield 1, make(rand_grid(rng, n, m, rng.choice([0.2, 0.4, 0.5, 0.6]))), "ngẫu nhiên nhỏ"
    yield 2, make([["."] * 1000 for _ in range(1000)]), "1000x1000 trống"
    yield 2, make(checker(1000, 1000)), "bàn cờ 1000x1000: 500000 vùng"
    yield 2, make(snake_grid(1000, 1000)), "hình rắn 1000x1000 (DFS đệ quy rất sâu)"
    yield 2, make([["."] * 1000]), "1 hàng"
    yield 2, make([["."] for _ in range(1000)]), "1 cột"
    for i in range(40):
        n = 1000 if i < 6 else rng.randint(51, 400)
        m = 1000 if i < 6 else rng.randint(51, 400)
        yield 2, make(rand_grid(rng, n, m, rng.choice([0.3, 0.45, 0.55, 0.65]))), "ngẫu nhiên lớn"


def validate(inp, sub):
    ls = inp.split()
    n, m = int(ls[0]), int(ls[1])
    lim = 50 if sub == 1 else 1000
    check(1 <= n <= lim and 1 <= m <= lim and len(ls) == n + 2, f"n={n} m={m}")
    for r in ls[2:]:
        check(len(r) == m and set(r) <= set(".#"), "hàng sai")
