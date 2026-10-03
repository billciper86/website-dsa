Một tên trộm mang theo cái túi chịu được tối đa **W** kg. Trong nhà có **n** món đồ, món thứ i nặng **wᵢ** kg và có giá trị **vᵢ**. Mỗi món chỉ có **một chiếc**: lấy hoặc không lấy, không cắt nhỏ được.

Hãy chọn các món có tổng khối lượng **≤ W** sao cho **tổng giá trị lớn nhất**.

## Dữ liệu vào
- Dòng 1: hai số nguyên **n, W** (1 ≤ n ≤ 100, 1 ≤ W ≤ 10⁵).
- n dòng sau, mỗi dòng hai số nguyên **wᵢ, vᵢ** (1 ≤ wᵢ ≤ 10⁵, 1 ≤ vᵢ ≤ 10⁹).

## Kết quả
Một số nguyên là tổng giá trị lớn nhất.

## Ví dụ
```input
3 8
3 30
4 50
5 60
```
```output
90
```

**Giải thích:** lấy món 1 và món 3 (nặng 3 + 5 = 8, giá trị 30 + 60 = 90).

## Subtask
| Subtask | Điểm | Giới hạn thêm |
|---|---|---|
| 1 | 30 | n ≤ 20 |
| 2 | 70 | Không có giới hạn gì thêm |

> **Gợi ý:** Subtask 1 có thể thử mọi tập con (2²⁰ ≈ 10⁶). QHĐ: gọi **dp[j]** là giá trị lớn nhất khi tổng khối lượng ≤ j. Duyệt từng món, rồi cập nhật j **từ W giảm về wᵢ**: dp[j] = max(dp[j], dp[j − wᵢ] + vᵢ). Nếu duyệt j tăng dần thì một món có thể bị lấy nhiều lần. Tổng giá trị có thể tới 10¹¹.
