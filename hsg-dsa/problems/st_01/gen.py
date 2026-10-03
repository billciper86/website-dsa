# -*- coding: utf-8 -*-
# Bộ sinh test bài Ký tự phổ biến nhất. Mỗi phần tử: (subtask, input, ghi chú)
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from genlib import *

SEED = 1411
L = 10**6
AZ = "abcdefghijklmnopqrstuvwxyz"


def make(s):
    return build(s)


def tie_str(rng, n, letters):
    """Các ký tự trong letters xuất hiện đúng bằng nhau (bẫy chọn khi hòa)."""
    k = max(1, n // len(letters))
    s = list("".join(c * k for c in letters))
    rng.shuffle(s)
    return "".join(s)


def tests(rng):
    yield 1, make("hocsinhgioi"), "ví dụ đề bài"
    yield 1, make("z"), "1 ký tự"
    yield 1, make("ba"), "hòa -> chọn 'a'"
    yield 1, make(AZ), "đủ 26 chữ, mỗi chữ 1 lần -> a 1"
    yield 1, make("z" * 1000), "toàn 'z'"
    yield 1, make(tie_str(rng, 1000, "xyz")), "hòa giữa x, y, z"
    for _ in range(19):
        n = rng.randint(1, 1000)
        r = rng.random()
        s = tie_str(rng, n, rng.sample(AZ, rng.randint(2, 5))) if r < 0.4 else rand_str(rng, n, rng.choice(["ab", "abc", AZ, "mnz"]))
        yield 1, make(s), "ngẫu nhiên nhỏ"
    yield 2, make("y" * L), "toàn 'y', 1e6"
    yield 2, make(tie_str(rng, L, "qrs")), "hòa giữa 3 chữ, 1e6"
    yield 2, make(tie_str(rng, L - L % 26, AZ)), "26 chữ bằng nhau"
    for i in range(43):
        n = L if i < 5 else rng.randint(1001, 100000)
        r = rng.random()
        s = tie_str(rng, n, rng.sample(AZ, rng.randint(2, 6))) if r < 0.4 else rand_str(rng, n, rng.choice(["ab", AZ, "xyz"]))
        yield 2, make(s), "ngẫu nhiên lớn"


def validate(inp, sub):
    s = inp.strip()
    check(1 <= len(s) <= (1000 if sub == 1 else L), f"|s|={len(s)}")
    check(set(s) <= set(AZ), "ký tự lạ")
