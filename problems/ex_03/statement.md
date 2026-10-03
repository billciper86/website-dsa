Một nhà thám hiểm đi trên lưới **n × m** từ ô **(1, 1)** tới ô **(n, m)**, mỗi bước chỉ đi **sang phải** hoặc **xuống dưới**. Ô (i, j) chứa **aᵢⱼ** đồng vàng; nếu aᵢⱼ âm thì đó là bẫy, đi qua sẽ bị mất tiền. Nhà thám hiểm nhận (hoặc mất) tiền ở **mọi ô đi qua**, kể cả ô đầu và ô cuối.

Hãy tìm **tổng tiền lớn nhất** có thể thu được.

## Dữ liệu vào
- Dòng 1: hai số nguyên **n, m** (1 ≤ n, m ≤ 500).
- n dòng sau, mỗi dòng m số nguyên aᵢⱼ (|aᵢⱼ| ≤ 10⁹).

## Kết quả
Một số nguyên là tổng lớn nhất.

## Ví dụ
```input
3 3
1 -2 3
4 5 -6
-1 2 7
```
```output
19
```

**Giải thích:** đi 1 → 4 → 5 → 2 → 7, tổng 19.

## Subtask
| Subtask | Điểm | Giới hạn thêm |
|---|---|---|
| 1 | 30 | n, m ≤ 10 |
| 2 | 30 | aᵢⱼ ≥ 0 |
| 3 | 40 | Không có giới hạn gì thêm |
