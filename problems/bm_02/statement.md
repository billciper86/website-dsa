Có **n** bạn và **n** công việc. Bạn thứ i làm việc thứ j tốn **cᵢⱼ** phút. Hãy giao cho **mỗi bạn đúng một việc** và **mỗi việc đúng một bạn** sao cho **tổng thời gian nhỏ nhất**.

## Dữ liệu vào
- Dòng 1: số nguyên **n** (1 ≤ n ≤ 20).
- n dòng sau, dòng i gồm n số cᵢ₁ … cᵢₙ (1 ≤ cᵢⱼ ≤ 10⁹).

## Kết quả
Một số nguyên là tổng thời gian nhỏ nhất.

## Ví dụ
```input
3
4 1 3
2 1 5
3 2 2
```
```output
5
```

**Giải thích:** bạn 1 làm việc 2 (1 phút), bạn 2 làm việc 1 (2 phút), bạn 3 làm việc 3 (2 phút): tổng 5.

## Subtask
| Subtask | Điểm | Giới hạn thêm |
|---|---|---|
| 1 | 40 | n ≤ 8 |
| 2 | 60 | Không có giới hạn gì thêm |
