Xưởng mộc có **n** khúc gỗ, khúc thứ i dài **aᵢ** mét. Cần cắt ra **ít nhất k** thanh gỗ có **cùng độ dài L** (L là số nguyên dương). Mỗi thanh phải được cắt từ **một** khúc gỗ, không được ghép hai mẩu lại với nhau. Phần thừa thì bỏ đi.

Hãy tìm **L lớn nhất** có thể. Nếu không cắt được k thanh nào (kể cả với L = 1) thì in ra **0**.

## Dữ liệu vào
- Dòng 1: hai số nguyên **n, k** (1 ≤ n ≤ 2·10⁵, 1 ≤ k ≤ 10¹⁵).
- Dòng 2: n số nguyên a₁ … aₙ (1 ≤ aᵢ ≤ 10⁹).

## Kết quả
Một số nguyên là L lớn nhất tìm được, hoặc 0.

## Ví dụ
```input
4 7
8 12 5 3
```
```output
3
```

**Giải thích:** với L = 3 ta cắt được 2 + 4 + 1 + 1 = 8 ≥ 7 thanh. Còn với L = 4 chỉ cắt được 2 + 3 + 1 + 0 = 6 < 7 thanh.

## Subtask
| Subtask | Điểm | Giới hạn thêm |
|---|---|---|
| 1 | 40 | n ≤ 1000, aᵢ ≤ 1000 |
| 2 | 60 | Không có giới hạn gì thêm |

> **Gợi ý:** L càng lớn thì số thanh cắt được càng ít. Vì tính chất **đơn điệu** này nên có thể **chặt nhị phân theo kết quả** L. Khi L nhỏ, tổng số thanh có thể tới 2·10¹⁴.
