Có **n** thành phố đánh số 0 … n−1. Đi từ thành phố i tới thành phố j mất **dᵢⱼ** giờ (có thể dᵢⱼ ≠ dⱼᵢ). Một người xuất phát từ thành phố **0**, muốn đi qua **mỗi thành phố còn lại đúng một lần** rồi **quay về 0**. Tìm tổng thời gian nhỏ nhất.

## Dữ liệu vào
- Dòng 1: số nguyên **n** (2 ≤ n ≤ 16).
- n dòng sau, dòng i gồm n số dᵢ₀ … dᵢ,ₙ₋₁ (dᵢᵢ = 0; 1 ≤ dᵢⱼ ≤ 10⁹ khi i ≠ j).

## Kết quả
Một số nguyên là tổng thời gian nhỏ nhất.

## Ví dụ
```input
4
0 10 15 20
10 0 35 25
15 35 0 30
20 25 30 0
```
```output
80
```

**Giải thích:** 0 → 1 → 3 → 2 → 0: 10 + 25 + 30 + 15 = 80.

## Subtask
| Subtask | Điểm | Giới hạn thêm |
|---|---|---|
| 1 | 40 | n ≤ 9 |
| 2 | 60 | Không có giới hạn gì thêm |
