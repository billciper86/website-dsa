Cho dãy **n** số nguyên **dương** a₁, a₂, …, aₙ và số **S**. Tìm **độ dài lớn nhất** của một đoạn con liên tiếp có tổng **không vượt quá S**. Nếu mọi phần tử đều lớn hơn S thì in ra 0.

## Dữ liệu vào
- Dòng 1: hai số nguyên **n, S** (1 ≤ n ≤ 2·10⁵, 1 ≤ S ≤ 10¹⁵).
- Dòng 2: n số nguyên a₁ … aₙ (1 ≤ aᵢ ≤ 10⁹).

## Kết quả
Một số nguyên là độ dài lớn nhất tìm được.

## Ví dụ
```input
7 10
4 2 1 3 6 1 1
```
```output
4
```

**Giải thích:** đoạn [1, 4] gồm 4 2 1 3 có tổng 10 ≤ 10 và dài 4. Mọi đoạn dài 5 đều có tổng lớn hơn 10.

## Subtask
| Subtask | Điểm | Giới hạn thêm |
|---|---|---|
| 1 | 40 | n ≤ 5000 |
| 2 | 60 | Không có giới hạn gì thêm |

> **Gợi ý:** Vì mọi số đều dương nên khi đầu phải r tiến lên thì đầu trái l **không bao giờ phải lùi lại**. Hai con trỏ l, r chạy cùng chiều, tổng cộng O(n).
