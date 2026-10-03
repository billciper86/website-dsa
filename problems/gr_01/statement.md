Trường có **một** phòng họp và **n** cuộc họp đăng ký. Cuộc họp thứ i bắt đầu lúc **sᵢ** và kết thúc lúc **eᵢ**. Hai cuộc họp không được diễn ra cùng lúc, nhưng một cuộc họp **được phép bắt đầu đúng lúc** cuộc họp trước vừa kết thúc.

Hãy chọn **nhiều cuộc họp nhất** có thể xếp vào phòng.

## Dữ liệu vào
- Dòng 1: số nguyên **n** (1 ≤ n ≤ 2·10⁵).
- n dòng sau, mỗi dòng hai số nguyên **sᵢ, eᵢ** (0 ≤ sᵢ < eᵢ ≤ 10⁹).

## Kết quả
Một số nguyên là số cuộc họp nhiều nhất.

## Ví dụ
```input
5
1 4
3 5
0 6
5 7
8 9
```
```output
3
```

**Giải thích:** chọn được 3 cuộc họp là [1, 4], [5, 7] và [8, 9].

## Subtask
| Subtask | Điểm | Giới hạn thêm |
|---|---|---|
| 1 | 30 | n ≤ 15 |
| 2 | 70 | Không có giới hạn gì thêm |

> **Gợi ý:** Subtask 1 có thể thử mọi tập con (2¹⁵ tập). Cách tham lam đúng là: **sắp xếp theo thời điểm kết thúc tăng dần**, rồi lần lượt chọn cuộc họp nào không trùng với cuộc vừa chọn. Thử tự tìm phản ví dụ cho cách "sắp theo giờ bắt đầu" và cách "sắp theo độ dài ngắn nhất".
