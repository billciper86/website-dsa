Cho **T** cặp số nguyên dương **a, b**. Với mỗi cặp, hãy in ra **ước chung lớn nhất** và **bội chung nhỏ nhất** của chúng.

## Dữ liệu vào
- Dòng đầu: số nguyên **T** (1 ≤ T ≤ 10⁵).
- T dòng sau, mỗi dòng hai số nguyên **a, b** (1 ≤ a, b ≤ 10¹⁸). Dữ liệu đảm bảo BCNN(a, b) ≤ 10¹⁸.

## Kết quả
In ra T dòng, mỗi dòng gồm hai số: ƯCLN(a, b) và BCNN(a, b).

## Ví dụ
```input
3
12 18
7 5
6 6
```
```output
6 36
1 35
6 6
```

## Subtask
| Subtask | Điểm | Giới hạn thêm |
|---|---|---|
| 1 | 30 | a, b ≤ 10⁴, T ≤ 100 |
| 2 | 30 | a, b ≤ 10⁹ |
| 3 | 40 | Không có giới hạn gì thêm |

> **Gợi ý:** Thuật toán Euclid: gcd(a, b) = gcd(b, a mod b), chạy O(log). BCNN = a / gcd · b. Hãy **chia trước rồi mới nhân**: viết a · b / gcd thì tích a · b có thể tới 10³⁶ và tràn số.
