Cho hai xâu **s** và **t** gồm chữ cái thường. Hãy tìm độ dài **xâu con chung dài nhất** của chúng. "Xâu con" ở đây nghĩa là xóa đi một số ký tự (có thể không xóa) và **giữ nguyên thứ tự** các ký tự còn lại; các ký tự **không cần liền nhau**.

## Dữ liệu vào
- Dòng 1: xâu **s** (1 ≤ |s| ≤ 5000).
- Dòng 2: xâu **t** (1 ≤ |t| ≤ 5000).

## Kết quả
Một số nguyên là độ dài xâu con chung dài nhất.

## Ví dụ
```input
abcbdab
bdcaba
```
```output
4
```

**Giải thích:** một xâu con chung dài nhất là "bcba".

## Subtask
| Subtask | Điểm | Giới hạn thêm |
|---|---|---|
| 1 | 30 | \|s\|, \|t\| ≤ 12 |
| 2 | 70 | Không có giới hạn gì thêm |

> **Gợi ý:** Gọi **f[i][j]** là đáp án cho i ký tự đầu của s và j ký tự đầu của t. Nếu sᵢ = tⱼ thì f[i][j] = f[i−1][j−1] + 1. Ngược lại f[i][j] = max(f[i−1][j], f[i][j−1]). Bảng 5001 × 5001 số `int` tốn khoảng 100 MB, vẫn vừa giới hạn. Có thể chỉ giữ 2 hàng để tiết kiệm bộ nhớ.
