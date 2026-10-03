# -*- coding: utf-8 -*-
# Bộ sinh test bài Xâu con chung dài nhất. Mỗi phần tử: (subtask, input, ghi chú)
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from genlib import *

SEED = 1333
L = 5000


def make(s, t):
    return build(s, t)


def related(rng, n, m, alpha):
    """t được tạo từ s bằng cách xóa/sửa/chèn ngẫu nhiên -> có LCS dài."""
    s = rand_str(rng, n, alpha)
    t = []
    for c in s:
        r = rng.random()
        if r < 0.15:
            continue
        if r < 0.3:
            t.append(rng.choice(alpha))
        t.append(c)
    t = "".join(t)[:m] or rng.choice(alpha)
    return s, t


def tests(rng):
    yield 1, make("abcbdab", "bdcaba"), "ví dụ đề bài"
    yield 1, make("a", "a"), "1 ký tự giống"
    yield 1, make("a", "b"), "1 ký tự khác -> 0"
    yield 1, make("abc", "xyz"), "không có ký tự chung"
    yield 1, make("aaaaaaaaaaaa", "aaaaa"), "toàn cùng ký tự"
    yield 1, make("zaaaa", "aaaaz"), "bẫy tham lam"
    yield 1, make("abcdefghijkl", "abcdefghijkl"), "hai xâu giống nhau"
    for _ in range(18):
        alpha = rng.choice(["ab", "abc", "abcdefghijklmnopqrstuvwxyz"])
        if rng.random() < 0.5:
            s, t = related(rng, rng.randint(1, 12), 12, alpha)
        else:
            s, t = rand_str(rng, rng.randint(1, 12), alpha), rand_str(rng, rng.randint(1, 12), alpha)
        yield 1, make(s, t), "ngẫu nhiên nhỏ"
    yield 2, make("a" * L, "a" * L), "toàn 'a', 5000x5000"
    yield 2, make("a" * L, "b" * L), "không có ký tự chung"
    yield 2, make("z" + "a" * (L - 1), "a" * (L - 1) + "z"), "bẫy tham lam, n lớn"
    yield 2, make("ab" * (L // 2), "ba" * (L // 2)), "xen kẽ"
    for i in range(42):
        n = L if i < 6 else rng.randint(1, 2000)
        m = L if i < 6 else rng.randint(1, 2000)
        alpha = rng.choice(["ab", "abcd", "abcdefghijklmnopqrstuvwxyz"])
        if i % 2:
            s, t = related(rng, n, m, alpha)
        else:
            s, t = rand_str(rng, n, alpha), rand_str(rng, m, alpha)
        yield 2, make(s, t), "ngẫu nhiên lớn"


def validate(inp, sub):
    ls = inp.split()
    check(len(ls) == 2, "cần 2 xâu")
    lim = 12 if sub == 1 else L
    for x in ls:
        check(1 <= len(x) <= lim and x.isalpha() and x.islower(), "xâu sai")
