Một khu vườn hình chữ nhật được chia thành lưới **n** hàng, **m** cột. Ô ở hàng i, cột j có sản lượng **aᵢⱼ**, có thể âm nếu ô đó bị sâu bệnh. Có **q** câu hỏi, mỗi câu hỏi cho một hình chữ nhật con với góc trên trái **(x₁, y₁)** và góc dưới phải **(x₂, y₂)**: hãy tính tổng sản lượng các ô bên trong hình đó.

## Dữ liệu vào
- Dòng 1: ba số nguyên **n, m, q** (1 ≤ n, m ≤ 500, 1 ≤ q ≤ 10⁵).
- n dòng tiếp theo, mỗi dòng m số nguyên aᵢⱼ (|aᵢⱼ| ≤ 10⁹).
- q dòng sau, mỗi dòng bốn số **x₁ y₁ x₂ y₂** (1 ≤ x₁ ≤ x₂ ≤ n, 1 ≤ y₁ ≤ y₂ ≤ m).

## Kết quả
In ra q dòng, mỗi dòng là tổng của hình chữ nhật tương ứng.

## Ví dụ
```input
3 4 3
1 2 3 4
5 6 7 8
9 10 11 12
1 1 2 2
2 2 3 4
3 1 3 1
```
```output
14
54
9
```

## Subtask
| Subtask | Điểm | Giới hạn thêm |
|---|---|---|
| 1 | 30 | n, m ≤ 50, q ≤ 100 |
| 2 | 30 | 0 ≤ aᵢⱼ ≤ 100 |
| 3 | 40 | Không có giới hạn gì thêm |

> **Gợi ý:** Gọi **S[i][j]** là tổng hình chữ nhật từ (1,1) đến (i,j). Khi đó tổng hình (x₁,y₁)–(x₂,y₂) bằng S[x₂][y₂] − S[x₁−1][y₂] − S[x₂][y₁−1] + S[x₁−1][y₁−1]. Tổng có thể lên tới 2,5·10¹⁴, cần dùng long long.
