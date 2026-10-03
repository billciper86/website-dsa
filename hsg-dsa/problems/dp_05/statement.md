Cho dãy **n** số nguyên a₁, a₂, …, aₙ. Hãy chọn ra một **dãy con** (giữ nguyên thứ tự, **không cần liên tiếp**) **tăng ngặt** và **dài nhất** có thể. In ra độ dài của dãy con đó.

## Dữ liệu vào
- Dòng 1: số nguyên **n** (1 ≤ n ≤ 2·10⁵).
- Dòng 2: n số nguyên a₁ … aₙ (|aᵢ| ≤ 10⁹).

## Kết quả
Một số nguyên là độ dài dãy con tăng dài nhất.

## Ví dụ
```input
8
5 2 8 6 3 6 9 7
```
```output
4
```

**Giải thích:** một dãy con tăng dài nhất là 2, 3, 6, 9. Lưu ý 2, 6, 6 không tính vì tăng **ngặt** nghĩa là không được bằng nhau.

## Subtask
| Subtask | Điểm | Giới hạn thêm |
|---|---|---|
| 1 | 20 | n ≤ 20 |
| 2 | 50 | n ≤ 5000 |
| 3 | 30 | Không có giới hạn gì thêm |

> **Gợi ý:** QHĐ O(n²): gọi **f[i]** là độ dài dãy con tăng dài nhất **kết thúc tại i**. Khi đó f[i] = 1 + max{ f[j] : j < i, aⱼ < aᵢ }. Cách này lấy được **70 điểm**. Muốn 100 điểm cần cách O(n log n): giữ mảng `tail` và dùng `lower_bound` (xem bài giảng).
