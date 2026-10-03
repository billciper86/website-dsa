Một xâu được gọi là **đối xứng (palindrome)** nếu đọc xuôi và đọc ngược giống nhau, ví dụ `aba`, `abba`, `z`. Cho xâu **s**, hãy tìm độ dài của **xâu con liên tiếp đối xứng dài nhất** của s.

## Dữ liệu vào
Một dòng chứa xâu **s** gồm chữ cái thường (1 ≤ |s| ≤ 5000).

## Kết quả
Một số nguyên là độ dài lớn nhất.

## Ví dụ
```input
cabbadx
```
```output
4
```

**Giải thích:** xâu con `abba` đối xứng và dài 4.

## Subtask
| Subtask | Điểm | Giới hạn thêm |
|---|---|---|
| 1 | 30 | \|s\| ≤ 100 |
| 2 | 70 | Không có giới hạn gì thêm |

> **Gợi ý:** Thử mọi xâu con rồi kiểm tra đối xứng mất O(n³), đủ cho subtask 1. Cách tốt hơn là **mở rộng từ tâm**: chọn tâm, rồi loang sang hai bên khi hai ký tự còn bằng nhau. Có 2 loại tâm: **một ký tự** (độ dài lẻ) và **giữa hai ký tự** (độ dài chẵn). Độ phức tạp O(n²).
