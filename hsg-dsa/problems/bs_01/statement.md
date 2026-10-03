Cho dãy **n** số nguyên a₁, a₂, …, aₙ (chưa sắp xếp) và **q** câu hỏi. Mỗi câu hỏi gồm hai số **x ≤ y**: hãy đếm xem dãy có bao nhiêu phần tử có giá trị nằm trong đoạn **[x, y]**.

## Dữ liệu vào
- Dòng 1: hai số nguyên **n, q** (1 ≤ n, q ≤ 2·10⁵).
- Dòng 2: n số nguyên a₁ … aₙ (|aᵢ| ≤ 10⁹).
- q dòng sau, mỗi dòng hai số **x, y** (−10⁹ ≤ x ≤ y ≤ 10⁹).

## Kết quả
In ra q dòng, mỗi dòng là đáp án của một câu hỏi.

## Ví dụ
```input
6 3
5 1 3 3 9 7
3 7
4 4
-5 100
```
```output
4
0
6
```

**Giải thích:** trong [3, 7] có các số 5, 3, 3, 7.

## Subtask
| Subtask | Điểm | Giới hạn thêm |
|---|---|---|
| 1 | 40 | n, q ≤ 1000 |
| 2 | 60 | Không có giới hạn gì thêm |

> **Gợi ý:** Sắp xếp dãy, rồi số phần tử trong [x, y] = `upper_bound(y) − lower_bound(x)`.
