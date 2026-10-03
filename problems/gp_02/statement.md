Mê cung là lưới **n × m**. Ô `#` là tường, ô `.` là đường đi, ô `S` là điểm xuất phát, ô `T` là đích (mỗi ô S, T có đúng một). Mỗi bước được đi sang **một ô kề cạnh** (trên, dưới, trái, phải) không phải tường.

Hãy tìm **số bước ít nhất** để đi từ S tới T. Nếu không thể tới được thì in ra **−1**.

## Dữ liệu vào
- Dòng 1: hai số nguyên **n, m** (1 ≤ n, m ≤ 1000, n·m ≥ 2).
- n dòng sau, mỗi dòng là xâu dài m gồm `.`, `#`, `S`, `T`.

## Kết quả
Một số nguyên là số bước ít nhất, hoặc −1.

## Ví dụ
```input
4 5
S.#..
.##.#
...T.
#.#..
```
```output
5
```

**Giải thích:** đường ngắn nhất là S(1,1) → (2,1) → (3,1) → (3,2) → (3,3) → T(3,4), gồm 5 bước.

## Subtask
| Subtask | Điểm | Giới hạn thêm |
|---|---|---|
| 1 | 40 | n, m ≤ 50 |
| 2 | 60 | Không có giới hạn gì thêm |

> **Gợi ý:** BFS loang từ S theo từng "lớp". Ô được thăm lần đầu tiên thì khoảng cách lúc đó **chắc chắn ngắn nhất**, vì mỗi bước có cùng độ dài 1. DFS **không** cho đường ngắn nhất.
