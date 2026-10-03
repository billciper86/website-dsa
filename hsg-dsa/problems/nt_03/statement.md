Cho **T** cặp số **a, b**. Với mỗi cặp, hãy tính **aᵇ mod (10⁹ + 7)**. Quy ước 0⁰ = 1.

## Dữ liệu vào
- Dòng đầu: số nguyên **T** (1 ≤ T ≤ 10⁵).
- T dòng sau, mỗi dòng hai số nguyên **a, b** (0 ≤ a ≤ 10¹⁸, 0 ≤ b ≤ 10¹⁸).

## Kết quả
In ra T dòng, mỗi dòng là aᵇ mod (10⁹ + 7).

## Ví dụ
```input
3
2 10
3 0
1000000007 5
```
```output
1024
1
0
```

## Subtask
| Subtask | Điểm | Giới hạn thêm |
|---|---|---|
| 1 | 30 | a ≤ 10⁹, b ≤ 1000, T ≤ 100 |
| 2 | 30 | a ≤ 10⁹ |
| 3 | 40 | Không có giới hạn gì thêm |

> **Gợi ý:** Dùng **lũy thừa nhanh**: aᵇ = (a^(b/2))² nếu b chẵn, và a · a^(b−1) nếu b lẻ, độ phức tạp O(log b). Phải **lấy a mod M trước**: nếu a ≈ 10¹⁸ thì a · a tràn long long.
