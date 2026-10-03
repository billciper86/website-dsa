Cho dãy **n** số nguyên a₁, a₂, …, aₙ (có thể âm). Hãy tìm một **đoạn con liên tiếp khác rỗng** có **tổng lớn nhất** và in ra tổng đó.

## Dữ liệu vào
- Dòng 1: số nguyên **n** (1 ≤ n ≤ 2·10⁵).
- Dòng 2: n số nguyên a₁ … aₙ (|aᵢ| ≤ 10⁹).

## Kết quả
Một số nguyên là tổng lớn nhất.

## Ví dụ
```input
8
-2 1 -3 4 -1 2 1 -5
```
```output
6
```

**Giải thích:** đoạn 4 −1 2 1 có tổng 6.

## Subtask
| Subtask | Điểm | Giới hạn thêm |
|---|---|---|
| 1 | 30 | n ≤ 1000 |
| 2 | 70 | Không có giới hạn gì thêm |

> **Gợi ý (Kadane):** gọi **f[i]** là tổng lớn nhất của đoạn **kết thúc tại i**. Khi đó f[i] = max(aᵢ, f[i−1] + aᵢ): hoặc nối tiếp đoạn trước, hoặc bắt đầu đoạn mới tại i. Đáp án là max của mọi f[i]. Đoạn không được rỗng, nên nếu mọi số đều âm thì đáp án cũng âm.
