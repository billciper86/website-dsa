Cho **q** câu hỏi, mỗi câu hỏi gồm hai số **l, r**. Hãy đếm số **số nguyên tố** trong đoạn **[l, r]**.

Nhắc lại: số nguyên tố là số nguyên lớn hơn 1, chỉ có hai ước là 1 và chính nó. Số 1 **không** phải số nguyên tố.

## Dữ liệu vào
- Dòng đầu: số nguyên **q** (1 ≤ q ≤ 10⁵).
- q dòng sau, mỗi dòng hai số nguyên **l, r** (1 ≤ l ≤ r ≤ 10⁷).

## Kết quả
In ra q dòng, mỗi dòng là đáp án của một câu hỏi.

## Ví dụ
```input
3
1 10
11 20
1 1
```
```output
4
4
0
```

## Subtask
| Subtask | Điểm | Giới hạn thêm |
|---|---|---|
| 1 | 30 | r ≤ 1000, q ≤ 100 |
| 2 | 30 | r ≤ 10⁶ |
| 3 | 40 | Không có giới hạn gì thêm |

> **Gợi ý:** Dùng **sàng Eratosthenes** để đánh dấu số nguyên tố tới 10⁷ (O(N log log N)), rồi dựng **mảng cộng dồn** cnt[i] = số nguyên tố ≤ i. Mỗi câu hỏi trả lời trong O(1) bằng cnt[r] − cnt[l−1].
