# -*- coding: utf-8 -*-
# Bộ sinh test bài Đếm hoán vị. Mỗi phần tử: (subtask, input, ghi chú)
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from genlib import *

SEED = 1433
L = 10**6
AZ = "abcdefghijklmnopqrstuvwxyz"


def make(s, p):
    return build(s, p)


def case(rng, n, m, alpha):
    s = rand_str(rng, n, alpha)
    if rng.random() < 0.7 and m <= n:            # p là hoán vị của 1 xâu con có thật -> đáp án >= 1
        i = rng.randint(0, n - m)
        p = list(s[i:i + m]); rng.shuffle(p); p = "".join(p)
    else:
        p = rand_str(rng, m, alpha)
    return make(s, p)


def tests(rng):
    yield 1, make("cbabcacab", "abc"), "ví dụ đề bài"
    yield 1, make("a", "a"), "1 ký tự"
    yield 1, make("ab", "abc"), "|p| > |s| -> 0"
    yield 1, make("abcba", "abc"), "khớp ở cửa sổ CUỐI (bẫy bỏ sót)"
    yield 1, make("a" * 1000, "aaa"), "toàn 'a' -> 998"
    yield 1, make("abc" * 333, "cab"), "khớp mọi vị trí"
    yield 1, make("xyz", "xyz"), "|p| = |s|"
    for _ in range(18):
        n = rng.randint(1, 1000)
        m = rng.randint(1, max(1, min(n + 2, rng.choice([3, 10, n]))))
        yield 1, case(rng, n, m, rng.choice(["ab", "abc", AZ])), "ngẫu nhiên nhỏ"
    yield 2, make("a" * L, "a" * (L // 2)), "|p| = 5e5 -> bắt cách sort từng cửa sổ"
    yield 2, make("ab" * (L // 2), "ba" * 1000), "xen kẽ"
    yield 2, make(rand_str(rng, L, "ab"), rand_str(rng, L, "ab")), "|p| = |s| = 1e6"
    yield 2, make(rand_str(rng, 1000, AZ), rand_str(rng, L, AZ)), "|p| > |s|"
    for i in range(42):
        n = L if i < 4 else rng.randint(1001, 200000)
        m = rng.choice([1, 3, 26, 1000, n // 2 + 1, n])
        yield 2, case(rng, n, m, rng.choice(["ab", "abcd", AZ])), "ngẫu nhiên lớn"


def validate(inp, sub):
    ls = inp.split()
    check(len(ls) == 2, "cần 2 xâu")
    s, p = ls
    check(1 <= len(s) <= (1000 if sub == 1 else L) and 1 <= len(p) <= L, "độ dài")
    check(set(s + p) <= set(AZ), "ký tự lạ")
