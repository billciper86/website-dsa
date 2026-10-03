Bạn nhận được **T** câu hỏi. Mỗi câu hỏi gồm ba số nguyên dương **a, b, k**: hãy đếm xem trong đoạn **[a, b]** có bao nhiêu số chia hết cho **k**.

## Dữ liệu vào
- Dòng đầu chứa số nguyên **T** (1 ≤ T ≤ 10⁵).
- T dòng tiếp theo, mỗi dòng chứa ba số nguyên **a, b, k** (1 ≤ a ≤ b ≤ 10¹⁸, 1 ≤ k ≤ 10¹⁸).

## Kết quả
In ra T dòng, dòng thứ i là đáp án của câu hỏi thứ i.

## Ví dụ
```input
3
1 10 3
5 5 5
7 20 4
```
```output
3
1
4
```

**Giải thích:** trong [1, 10] có 3, 6, 9. Trong [5, 5] có 5. Trong [7, 20] có 8, 12, 16, 20.

## Subtask
| Subtask | Điểm | Giới hạn thêm |
|---|---|---|
| 1 | 40 | b ≤ 10⁶, T ≤ 10 |
| 2 | 30 | b ≤ 10⁹ |
| 3 | 30 | Không có giới hạn gì thêm |

> **Gợi ý:** Duyệt từ a đến b chỉ qua được subtask 1. Với b lên tới 10⁹ hoặc 10¹⁸, bạn cần một **công thức O(1)**: thử nghĩ xem đoạn [1, b] có bao nhiêu bội của k.
