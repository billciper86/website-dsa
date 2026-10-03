Cho **T** số nguyên dương. Với mỗi số **n**, hãy đếm xem n có bao nhiêu **ước dương**.

## Dữ liệu vào
- Dòng đầu: số nguyên **T** (1 ≤ T ≤ 20).
- T dòng sau, mỗi dòng một số nguyên **n** (1 ≤ n ≤ 10¹²).

## Kết quả
In ra T dòng, mỗi dòng là số ước của số n tương ứng.

## Ví dụ
```input
3
1
12
36
```
```output
1
6
9
```

**Giải thích:** 12 có các ước 1, 2, 3, 4, 6, 12. Số 36 có 9 ước vì 6 × 6 = 36, nên ước 6 chỉ được đếm một lần.

## Subtask
| Subtask | Điểm | Giới hạn thêm |
|---|---|---|
| 1 | 40 | n ≤ 10⁶ |
| 2 | 60 | Không có giới hạn gì thêm |

> **Gợi ý:** Các ước đi theo cặp **(d, n/d)**, trong đó luôn có một ước ≤ √n. Vì vậy chỉ cần duyệt d từ 1 đến √n, tức là O(√n) ≈ 10⁶ phép cho mỗi số.
