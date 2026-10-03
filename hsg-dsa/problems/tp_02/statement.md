Một cửa hàng ghi lại lợi nhuận của **n** ngày liên tiếp: a₁, a₂, …, aₙ (ngày lỗ thì aᵢ âm). Hãy tìm **tổng lợi nhuận lớn nhất** của **k ngày liên tiếp**.

## Dữ liệu vào
- Dòng 1: hai số nguyên **n, k** (1 ≤ k ≤ n ≤ 2·10⁵).
- Dòng 2: n số nguyên a₁ … aₙ (|aᵢ| ≤ 10⁹).

## Kết quả
Một số nguyên là tổng lớn nhất.

## Ví dụ
```input
6 3
2 -1 4 -2 5 1
```
```output
7
```

**Giải thích:** các cửa sổ 3 ngày có tổng lần lượt là 5, 1, 7, 4. Lớn nhất là 7, ứng với 4 −2 5.

## Subtask
| Subtask | Điểm | Giới hạn thêm |
|---|---|---|
| 1 | 40 | n ≤ 5000 |
| 2 | 60 | Không có giới hạn gì thêm |

> **Gợi ý:** Khi cửa sổ trượt sang phải 1 ô, tổng mới = tổng cũ **+ phần tử vào − phần tử ra**. Chú ý: mọi số có thể đều âm.
