# -*- coding: utf-8 -*-
# Bộ sinh test bài Xâu đối xứng dài nhất. Mỗi phần tử: (subtask, input, ghi chú)
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from genlib import *

SEED = 1422
L = 5000
AZ = "abcdefghijklmnopqrstuvwxyz"


def make(s):
    return build(s)


def plant(rng, n, alpha, even):
    """Xâu ngẫu nhiên có cắm sẵn một xâu đối xứng dài."""
    s = list(rand_str(rng, n, alpha))
    half = rand_str(rng, rng.randint(1, max(1, n // 3)), alpha)
    p = half + ("" if even else rng.choice(alpha)) + half[::-1]
    p = p[:n]
    pos = rng.randint(0, n - len(p))
    s[pos:pos + len(p)] = list(p)
    return "".join(s)


def tests(rng):
    yield 1, make("cabbadx"), "ví dụ đề bài"
    yield 1, make("a"), "1 ký tự"
    yield 1, make("ab"), "không có đối xứng dài 2 -> 1"
    yield 1, make("aa"), "đối xứng độ dài chẵn nhỏ nhất"
    yield 1, make("abccbaxyz"), "đối xứng chẵn ở đầu (bẫy chỉ xét tâm lẻ)"
    yield 1, make("a" * 100), "toàn 'a'"
    yield 1, make("ab" * 50), "xen kẽ"
    for _ in range(18):
        n = rng.randint(1, 100)
        alpha = rng.choice(["ab", "abc", AZ])
        yield 1, make(plant(rng, n, alpha, rng.random() < 0.6) if rng.random() < 0.7 else rand_str(rng, n, alpha)), "ngẫu nhiên nhỏ"
    yield 2, make("a" * L), "toàn 'a', 5000 (bắt O(n^3))"
    yield 2, make("ab" * (L // 2)), "xen kẽ ab"
    yield 2, make(rand_str(rng, L, AZ)), "ngẫu nhiên 26 chữ"
    half = rand_str(rng, L // 2, "ab")
    yield 2, make(half + half[::-1]), "cả xâu đối xứng chẵn"
    for i in range(42):
        n = L if i < 10 else rng.randint(101, L)
        alpha = rng.choice(["ab", "abc", AZ])
        yield 2, make(plant(rng, n, alpha, i % 2 == 0) if i % 3 else rand_str(rng, n, alpha)), "ngẫu nhiên lớn"


def validate(inp, sub):
    s = inp.strip()
    check(1 <= len(s) <= (100 if sub == 1 else L) and set(s) <= set(AZ), f"|s|={len(s)}")
