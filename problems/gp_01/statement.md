Bản đồ một hòn đảo là lưới **n × m**: ô `.` là đất trống, ô `#` là núi. Hai ô đất trống **kề cạnh** nhau (chung một cạnh: trên, dưới, trái, phải) thuộc cùng một **vùng**. Hai ô chỉ chạm nhau ở góc thì **không** tính là kề.

Hãy đếm số vùng đất trống.

## Dữ liệu vào
- Dòng 1: hai số nguyên **n, m** (1 ≤ n, m ≤ 1000).
- n dòng sau, mỗi dòng là một xâu dài m gồm `.` và `#`.

## Kết quả
Một số nguyên là số vùng.

## Ví dụ
```input
4 5
..#..
.##..
#..#.
..#.#
```
```output
4
```

**Giải thích:** có 4 vùng: vùng góc trên trái (3 ô), vùng bên phải (5 ô), vùng ở giữa phía dưới (4 ô), và ô lẻ ở hàng 4 cột 4.

## Subtask
| Subtask | Điểm | Giới hạn thêm |
|---|---|---|
| 1 | 40 | n, m ≤ 50 |
| 2 | 60 | Không có giới hạn gì thêm |

> **Gợi ý:** Duyệt từng ô. Gặp ô `.` **chưa thăm** thì tăng số vùng lên 1 và **loang** (BFS hoặc DFS) để đánh dấu mọi ô cùng vùng với nó. Mỗi ô chỉ được thăm 1 lần, nên tổng O(n·m).
