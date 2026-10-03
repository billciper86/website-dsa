Cho hai xâu **s** và **p** gồm chữ cái thường. Hãy đếm xem có bao nhiêu vị trí **i** sao cho xâu con liên tiếp của s **bắt đầu tại i và dài |p|** là một **hoán vị** của p. Nói cách khác, xâu con đó gồm đúng các ký tự của p, mỗi ký tự với cùng số lần, chỉ khác thứ tự.

## Dữ liệu vào
- Dòng 1: xâu **s** (1 ≤ |s| ≤ 10⁶).
- Dòng 2: xâu **p** (1 ≤ |p| ≤ 10⁶).

## Kết quả
Một số nguyên là số vị trí thỏa mãn. Nếu |p| > |s| thì in ra 0.

## Ví dụ
```input
cbabcacab
abc
```
```output
4
```

**Giải thích:** các xâu con dài 3 của s là cba, bab, abc, bca, cac, aca, cab. Có 4 xâu là hoán vị của `abc`: **cba**, **abc**, **bca**, **cab**.

## Subtask
| Subtask | Điểm | Giới hạn thêm |
|---|---|---|
| 1 | 40 | \|s\| ≤ 1000 |
| 2 | 60 | Không có giới hạn gì thêm |

> **Gợi ý:** Đếm tần suất 26 chữ cái của p. Trượt một cửa sổ dài |p| trên s: mỗi bước thêm 1 ký tự vào, bỏ 1 ký tự ra, cập nhật bảng đếm của cửa sổ rồi so sánh với bảng của p (26 phép so sánh). Độ phức tạp O(26·|s|).
