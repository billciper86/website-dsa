Có **n** học sinh xếp hàng nộp hồ sơ ở **một** quầy. Học sinh thứ i cần **tᵢ** phút để làm thủ tục. Thầy giáo được quyền sắp xếp lại thứ tự hàng. Mỗi học sinh "tốn" khoảng thời gian **từ lúc quầy mở đến lúc mình làm xong thủ tục**.

Hãy sắp xếp thứ tự sao cho **tổng thời gian tốn của mọi học sinh là nhỏ nhất**, rồi in ra tổng đó.

## Dữ liệu vào
- Dòng 1: số nguyên **n** (1 ≤ n ≤ 2·10⁵).
- Dòng 2: n số nguyên t₁ … tₙ (1 ≤ tᵢ ≤ 10⁶).

## Kết quả
Một số nguyên là tổng thời gian nhỏ nhất.

## Ví dụ
```input
3
5 1 3
```
```output
14
```

**Giải thích:** xếp theo thứ tự 1, 3, 5 thì các học sinh xong lúc 1, 4 và 9 phút, tổng là 14. Nếu để nguyên thứ tự 5, 1, 3 thì tổng là 5 + 6 + 9 = 20.

## Subtask
| Subtask | Điểm | Giới hạn thêm |
|---|---|---|
| 1 | 20 | n ≤ 8 |
| 2 | 30 | n ≤ 1000, tᵢ ≤ 1000 |
| 3 | 50 | Không có giới hạn gì thêm |

> **Gợi ý:** Người đứng ở vị trí k (tính từ 1) làm **n − k + 1** người phải chờ thêm tᵢ phút, kể cả chính mình. Vậy người làm nhanh nên đứng trước. Tổng có thể lên tới khoảng 2·10¹⁶.
