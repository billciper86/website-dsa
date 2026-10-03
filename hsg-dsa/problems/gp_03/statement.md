Trường có **n** học sinh, đánh số từ 1 đến n. Có **m** cặp học sinh quen nhau trực tiếp. Hai học sinh **liên lạc được** với nhau nếu có một dãy người quen nối từ người này tới người kia: A quen B, B quen C, … Tự mình thì luôn liên lạc được với mình.

Có **q** câu hỏi, mỗi câu hỏi cho hai học sinh **u, v**: họ có liên lạc được với nhau không?

## Dữ liệu vào
- Dòng 1: ba số nguyên **n, m, q** (1 ≤ n ≤ 2·10⁵, 0 ≤ m ≤ 2·10⁵, 1 ≤ q ≤ 2·10⁵).
- m dòng tiếp, mỗi dòng hai số **a, b** (1 ≤ a, b ≤ n, a ≠ b): a và b quen nhau. Một cặp có thể xuất hiện nhiều lần.
- q dòng sau, mỗi dòng hai số **u, v** (1 ≤ u, v ≤ n).

## Kết quả
Với mỗi câu hỏi in `YES` hoặc `NO` trên một dòng.

## Ví dụ
```input
6 4 4
1 2
2 3
4 5
5 4
1 3
1 4
6 6
4 5
```
```output
YES
NO
YES
YES
```

## Subtask
| Subtask | Điểm | Giới hạn thêm |
|---|---|---|
| 1 | 40 | n, m, q ≤ 1000 |
| 2 | 60 | Không có giới hạn gì thêm |

> **Gợi ý:** Mỗi câu hỏi BFS lại từ đầu mất O(q·(n+m)), chỉ đủ cho subtask 1. Cách tốt: BFS/DFS **một lần** để gán **mã thành phần liên thông** comp[v] cho mọi đỉnh. Khi đó u, v liên lạc được khi và chỉ khi comp[u] = comp[v].
