Có **n** bóng đèn xếp thành hàng, bóng thứ i có màu **aᵢ** (màu được đánh số bằng số nguyên). Hãy chọn một **đoạn liên tiếp dài nhất** sao cho trong đoạn có **không quá K màu khác nhau**.

## Dữ liệu vào
- Dòng 1: hai số nguyên **n, K** (1 ≤ K ≤ n ≤ 2·10⁵).
- Dòng 2: n số nguyên a₁ … aₙ (1 ≤ aᵢ ≤ 10⁹).

## Kết quả
Một số nguyên là độ dài đoạn dài nhất.

## Ví dụ
```input
9 2
5 3 5 3 4 4 4 4 1
```
```output
5
```

**Giải thích:** đoạn 3 4 4 4 4 (vị trí 4 đến 8) chỉ có 2 màu và dài 5.

## Subtask
| Subtask | Điểm | Giới hạn thêm |
|---|---|---|
| 1 | 40 | n ≤ 2000 |
| 2 | 60 | Không có giới hạn gì thêm |

> **Gợi ý:** Dùng cửa sổ trượt [l, r] và `map<int,int> cnt` để đếm số lần mỗi màu xuất hiện trong cửa sổ. Khi số màu khác nhau vượt quá K thì tăng l. Lưu ý: màu tới 10⁹ nên không dùng mảng đếm trực tiếp được.
