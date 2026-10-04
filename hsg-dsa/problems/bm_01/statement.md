Cho **n** số nguyên dương a₁, a₂, …, aₙ và số **S**. Đếm số **tập con** (kể cả tập rỗng) của dãy có tổng **đúng bằng S**. Hai tập con khác nhau nếu chọn khác nhau ít nhất một **vị trí**.

## Dữ liệu vào
- Dòng 1: hai số nguyên **n, S** (1 ≤ n ≤ 20, 0 ≤ S ≤ 2·10¹⁰).
- Dòng 2: n số nguyên a₁ … aₙ (1 ≤ aᵢ ≤ 10⁹).

## Kết quả
Một số nguyên là số tập con thỏa mãn.

## Ví dụ
```input
4 5
1 2 3 4
```
```output
2
```

**Giải thích:** {1, 4} và {2, 3}.

## Subtask
| Subtask | Điểm | Giới hạn thêm |
|---|---|---|
| 1 | 40 | n ≤ 10 |
| 2 | 60 | Không có giới hạn gì thêm |
