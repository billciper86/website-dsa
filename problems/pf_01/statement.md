Cho dãy **n** số nguyên a₁, a₂, …, aₙ và **q** câu hỏi. Mỗi câu hỏi gồm hai số **l, r**: hãy tính tổng **aₗ + aₗ₊₁ + … + aᵣ**.

## Dữ liệu vào
- Dòng 1: hai số nguyên **n, q** (1 ≤ n, q ≤ 2·10⁵).
- Dòng 2: n số nguyên a₁ … aₙ (|aᵢ| ≤ 10⁹).
- q dòng sau, mỗi dòng hai số **l, r** (1 ≤ l ≤ r ≤ n).

## Kết quả
In ra q dòng, mỗi dòng là đáp án của một câu hỏi.

## Ví dụ
```input
5 3
1 -2 3 4 5
1 3
2 5
4 4
```
```output
2
10
4
```

## Subtask
| Subtask | Điểm | Giới hạn thêm |
|---|---|---|
| 1 | 30 | n, q ≤ 1000 |
| 2 | 30 | 0 ≤ aᵢ ≤ 1000 |
| 3 | 40 | Không có giới hạn gì thêm |

> **Gợi ý:** Mỗi câu hỏi mà cộng bằng vòng for thì mất O(n), cả bài là O(n·q) = 4·10¹⁰, quá chậm. Hãy dựng mảng cộng dồn **p[i] = a₁ + … + aᵢ** thì mỗi câu hỏi trả lời trong O(1). Lưu ý tổng có thể lên tới 2·10¹⁴.
