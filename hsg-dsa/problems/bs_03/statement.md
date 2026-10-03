Phòng in của trường có **n** máy in. Máy thứ i in xong một bản trong đúng **tᵢ** giây. Các máy chạy **song song** cùng lúc, mỗi máy in lần lượt từng bản một. Cần in tổng cộng **m** bản đề thi.

Hỏi cần ít nhất bao nhiêu giây để in xong m bản?

## Dữ liệu vào
- Dòng 1: hai số nguyên **n, m** (1 ≤ n ≤ 2·10⁵, 1 ≤ m ≤ 10⁹).
- Dòng 2: n số nguyên t₁ … tₙ (1 ≤ tᵢ ≤ 10⁹).

## Kết quả
Một số nguyên là số giây ít nhất.

## Ví dụ
```input
3 7
3 2 5
```
```output
8
```

**Giải thích:** sau 8 giây, máy 1 in được 2 bản, máy 2 in được 4 bản, máy 3 in được 1 bản, tổng cộng 7 bản.

## Subtask
| Subtask | Điểm | Giới hạn thêm |
|---|---|---|
| 1 | 30 | n ≤ 1000, m ≤ 10⁵, tᵢ ≤ 1000 |
| 2 | 70 | Không có giới hạn gì thêm |

> **Gợi ý:** Trong T giây, cả phòng in được Σ ⌊T / tᵢ⌋ bản. T càng lớn thì in được càng nhiều, nên có thể chặt nhị phân T. Đáp án có thể lên tới 10¹⁸. Khi cộng Σ ⌊T / tᵢ⌋ với T lớn thì tổng **vượt cả long long**, vì vậy hãy dừng cộng ngay khi tổng đã ≥ m.
