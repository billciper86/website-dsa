Có **n** hòn đá xếp thành hàng, hòn thứ i cao **hᵢ**. Một chú ếch đứng ở hòn đá 1 và muốn tới hòn đá n. Mỗi lần nhảy, ếch đang ở hòn i có thể nhảy tới một trong các hòn **i+1, i+2, …, i+K**. Mỗi lần nhảy từ hòn i tới hòn j tốn **|hᵢ − hⱼ|** sức lực.

Hãy tìm **tổng sức lực nhỏ nhất** để ếch tới được hòn đá n.

## Dữ liệu vào
- Dòng 1: hai số nguyên **n, K** (2 ≤ n ≤ 10⁵, 1 ≤ K ≤ 100).
- Dòng 2: n số nguyên h₁ … hₙ (1 ≤ hᵢ ≤ 10⁴).

## Kết quả
Một số nguyên là tổng sức lực nhỏ nhất.

## Ví dụ
```input
5 3
10 30 40 50 20
```
```output
30
```

**Giải thích:** ếch đi 1 → 2 → 5, tốn |10 − 30| + |30 − 20| = 30.

## Subtask
| Subtask | Điểm | Giới hạn thêm |
|---|---|---|
| 1 | 20 | n ≤ 15 |
| 2 | 30 | K ≤ 2 |
| 3 | 50 | Không có giới hạn gì thêm |

> **Gợi ý:** gọi **f[i]** là sức lực nhỏ nhất để tới hòn i. Khi đó f[1] = 0 và f[i] = min{ f[j] + |hⱼ − hᵢ| } với i − K ≤ j < i. Độ phức tạp O(n·K) = 10⁷.
