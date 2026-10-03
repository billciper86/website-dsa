# -*- coding: utf-8 -*-
# Bộ sinh test bài Bạn bè. Mỗi phần tử: (subtask, input, ghi chú)
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from genlib import *

SEED = 1533
NMAX = 2 * 10**5


def make(n, edges, qs):
    return build(line(n, len(edges), len(qs)), *[line(a, b) for a, b in edges], *[line(u, v) for u, v in qs])


def groups_graph(rng, n, m, k):
    """Chia n đỉnh thành k nhóm, cạnh ngẫu nhiên trong cùng nhóm (cạnh hướng ngẫu nhiên: bẫy 1 chiều)."""
    grp = [rng.randrange(k) for _ in range(n + 1)]
    members = {}
    for v in range(1, n + 1):
        members.setdefault(grp[v], []).append(v)
    edges = []
    big = [g for g in members.values() if len(g) >= 2]
    if big:
        for _ in range(m):
            g = rng.choice(big)
            a, b = rng.sample(g, 2)
            edges.append((a, b))
    return edges, grp


def queries(rng, n, q, grp):
    res = []
    for _ in range(q):
        u = rng.randint(1, n)
        t = rng.random()
        if t < 0.45:                 # cùng nhóm -> hay ra YES
            v = u if t < 0.05 else rng.randint(1, n)
            for _ in range(20):
                w = rng.randint(1, n)
                if grp[w] == grp[u]: v = w; break
        else:
            v = rng.randint(1, n)
        res.append((u, v))
    return res


def case(rng, n, m, q):
    k = rng.choice([1, 2, 5, max(1, n // 3), max(1, n // 50)])
    edges, grp = groups_graph(rng, n, m, k)
    return make(n, edges, queries(rng, n, q, grp))


def tests(rng):
    yield 1, make(6, [(1, 2), (2, 3), (4, 5), (5, 4)], [(1, 3), (1, 4), (6, 6), (4, 5)]), "ví dụ đề bài"
    yield 1, make(1, [], [(1, 1)]), "1 người"
    yield 1, make(2, [], [(1, 2), (2, 1)]), "không ai quen ai"
    yield 1, make(3, [(2, 1), (3, 2)], [(1, 3), (3, 1)]), "cạnh ghi ngược chiều (bẫy 1 chiều)"
    chain = [(i + 1, i) for i in range(1, 1000)]
    yield 1, make(1000, chain, [(1, 1000), (1000, 1), (500, 1)] * 300), "chuỗi dài, cạnh ngược chiều"
    yield 1, make(1000, [(1, 2)] * 1000, [(1, 2), (2, 3)] * 500), "cạnh lặp lại"
    for _ in range(19):
        n = rng.randint(1, 1000)
        yield 1, case(rng, n, rng.randint(0, 1000), rng.randint(1, 1000)), "ngẫu nhiên nhỏ"
    chain = [(i + 1, i) for i in range(1, NMAX)]
    yield 2, make(NMAX, chain, [(1, NMAX)] * NMAX), "chuỗi 2e5 đỉnh, q=2e5 (bắt BFS mỗi câu)"
    yield 2, make(NMAX, [], [(rng.randint(1, NMAX), rng.randint(1, NMAX)) for _ in range(NMAX)]), "không có cạnh"
    yield 2, case(rng, NMAX, NMAX, NMAX), "ngẫu nhiên tối đa"
    for i in range(42):
        n = NMAX if i < 4 else rng.randint(1001, 30000)
        m = NMAX if i < 4 else rng.randint(0, 30000)
        q = NMAX if i < 4 else rng.randint(1, 30000)
        yield 2, case(rng, n, m, q), "ngẫu nhiên lớn"


def validate(inp, sub):
    v = ints(inp)
    n, m, q = v[0], v[1], v[2]
    lim = 1000 if sub == 1 else NMAX
    check(1 <= n <= lim and 0 <= m <= lim and 1 <= q <= lim, f"n={n} m={m} q={q}")
    check(len(v) == 3 + 2 * m + 2 * q, "số lượng số")
    for i in range(m):
        a, b = v[3 + 2 * i], v[4 + 2 * i]
        check(1 <= a <= n and 1 <= b <= n and a != b, "cạnh sai")
    check_range(v[3 + 2 * m:], 1, n, "truy vấn")
