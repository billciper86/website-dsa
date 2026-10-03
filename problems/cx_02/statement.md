Cho dãy **n** số nguyên dương a₁, a₂, …, aₙ và số nguyên dương **k**. Hãy đếm số cặp chỉ số **(i, j)** với **i < j** sao cho **aᵢ + aⱼ chia hết cho k**.

## Dữ liệu vào
- Dòng 1: hai số nguyên **n, k** (2 ≤ n ≤ 2·10⁵, 1 ≤ k ≤ 10⁶).
- Dòng 2: n số nguyên a₁ … aₙ (1 ≤ aᵢ ≤ 10⁹).

## Kết quả
Một số nguyên duy nhất là số cặp thỏa mãn.

## Ví dụ
```input
5 3
1 2 3 4 5
```
```output
4
```

**Giải thích:** có 4 cặp có tổng chia hết cho 3 là (1,2), (1,5), (2,4), (4,5), tính theo giá trị.

## Subtask
| Subtask | Điểm | Giới hạn thêm |
|---|---|---|
| 1 | 40 | n ≤ 2000 |
| 2 | 20 | k = 2 |
| 3 | 40 | Không có giới hạn gì thêm |

> **Gợi ý:** Hai vòng for O(n²) qua được subtask 1. Tổng aᵢ + aⱼ chia hết cho k khi và chỉ khi **(aᵢ mod k) + (aⱼ mod k)** bằng 0 hoặc bằng k. Vì vậy chỉ cần đếm xem mỗi số dư xuất hiện bao nhiêu lần. Chú ý: đáp án có thể lên tới khoảng 2·10¹⁰.
