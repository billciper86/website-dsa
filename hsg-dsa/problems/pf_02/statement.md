Cho dãy **n** số nguyên a₁, a₂, …, aₙ (có thể âm) và số nguyên **K**. Hãy đếm số **đoạn con liên tiếp [l, r]** (1 ≤ l ≤ r ≤ n) có tổng các phần tử **đúng bằng K**.

## Dữ liệu vào
- Dòng 1: hai số nguyên **n, K** (1 ≤ n ≤ 2·10⁵, |K| ≤ 10¹⁵).
- Dòng 2: n số nguyên a₁ … aₙ (|aᵢ| ≤ 10⁹).

## Kết quả
Một số nguyên duy nhất là số đoạn con có tổng bằng K.

## Ví dụ
```input
5 3
1 2 0 3 -3
```
```output
5
```

**Giải thích:** có 5 đoạn có tổng bằng 3 là [1,2], [1,3], [3,4], [4,4] và [1,5].

## Subtask
| Subtask | Điểm | Giới hạn thêm |
|---|---|---|
| 1 | 20 | n ≤ 300 |
| 2 | 30 | n ≤ 5000 |
| 3 | 20 | aᵢ ≥ 1, K ≥ 1 |
| 4 | 30 | Không có giới hạn gì thêm |

> **Gợi ý:** Tổng đoạn [l, r] bằng **p[r] − p[l−1]**. Điều kiện "tổng bằng K" trở thành **p[l−1] = p[r] − K**. Duyệt r từ trái sang phải và đếm xem giá trị p[r] − K đã xuất hiện bao nhiêu lần trong các p trước đó (dùng `map`). Đáp án có thể vượt 2·10⁹.
