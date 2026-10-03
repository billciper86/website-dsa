Bác Ba có **n** cây xếp thành hàng, đánh số từ 1 đến n. Lúc đầu cây thứ i cao **aᵢ** cm. Trong **m** ngày, mỗi ngày bác tưới một đoạn cây liên tiếp: mọi cây từ vị trí **l** đến vị trí **r** đều cao thêm **x** cm.

Hãy cho biết chiều cao của từng cây sau m ngày.

## Dữ liệu vào
- Dòng 1: hai số nguyên **n, m** (1 ≤ n, m ≤ 2·10⁵).
- Dòng 2: n số nguyên a₁ … aₙ (0 ≤ aᵢ ≤ 10⁹).
- m dòng sau, mỗi dòng ba số **l, r, x** (1 ≤ l ≤ r ≤ n, 1 ≤ x ≤ 10⁹).

## Kết quả
Một dòng gồm n số là chiều cao cuối cùng của các cây, cách nhau bởi dấu cách.

## Ví dụ
```input
5 3
1 2 3 4 5
1 3 10
2 5 1
5 5 100
```
```output
11 13 14 5 106
```

## Subtask
| Subtask | Điểm | Giới hạn thêm |
|---|---|---|
| 1 | 30 | n, m ≤ 1000 |
| 2 | 30 | aᵢ ≤ 1000, x ≤ 1000 |
| 3 | 40 | Không có giới hạn gì thêm |

> **Gợi ý:** Cộng x vào từng cây trong đoạn mất O(n) mỗi ngày, cả bài là O(n·m). Dùng **mảng hiệu**: cộng x vào d[l], trừ x ở d[r+1], cuối cùng cộng dồn d một lần là xong, O(n + m).
