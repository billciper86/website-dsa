Một robot đứng ở ô **(1, 1)** của lưới **n × m** và muốn đi tới ô **(n, m)**. Mỗi bước robot chỉ được đi **sang phải** hoặc **xuống dưới**. Ô `#` là vật cản, robot không được đi vào; ô `.` là ô trống.

Hãy đếm số đường đi khác nhau, in ra **phần dư khi chia cho 10⁹ + 7**.

## Dữ liệu vào
- Dòng 1: hai số nguyên **n, m** (1 ≤ n, m ≤ 1000).
- n dòng sau, mỗi dòng là một xâu dài m gồm các ký tự `.` và `#`.

## Kết quả
Một số nguyên là số đường đi mod 10⁹ + 7. Nếu ô xuất phát hoặc ô đích là `#` thì đáp án là 0.

## Ví dụ
```input
3 4
....
.#..
....
```
```output
4
```

## Subtask
| Subtask | Điểm | Giới hạn thêm |
|---|---|---|
| 1 | 30 | n, m ≤ 10 |
| 2 | 70 | Không có giới hạn gì thêm |

> **Gợi ý:** Gọi **f[i][j]** là số đường đi tới ô (i, j). Vì chỉ có thể đến (i, j) từ ô **bên trên** hoặc ô **bên trái**, nên f[i][j] = f[i−1][j] + f[i][j−1]. Nếu ô (i, j) là `#` thì f[i][j] = 0. Nhớ mod sau mỗi phép cộng.
