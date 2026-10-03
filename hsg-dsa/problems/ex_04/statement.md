Một khu rừng là lưới **n × m**: ô `F` đang cháy, ô `.` là cỏ khô, ô `#` là đá (không cháy). Mỗi phút, lửa từ **mọi** ô đang cháy lan sang các ô cỏ **kề cạnh** (trên, dưới, trái, phải).

Hỏi sau bao nhiêu phút thì **mọi ô cỏ** đều cháy? Nếu có ô cỏ không bao giờ cháy thì in ra **−1**. Nếu không có ô cỏ nào thì in ra **0**.

## Dữ liệu vào
- Dòng 1: hai số nguyên **n, m** (1 ≤ n, m ≤ 1000).
- n dòng sau, mỗi dòng là xâu dài m gồm `F`, `.`, `#`. Có ít nhất một ô `F`.

## Kết quả
Một số nguyên là số phút, hoặc −1.

## Ví dụ
```input
3 4
F..#
.#..
...F
```
```output
2
```

## Subtask
| Subtask | Điểm | Giới hạn thêm |
|---|---|---|
| 1 | 40 | n, m ≤ 50 |
| 2 | 60 | Không có giới hạn gì thêm |
