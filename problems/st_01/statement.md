Cho xâu **s** gồm các chữ cái thường từ `a` đến `z`. Hãy tìm ký tự **xuất hiện nhiều lần nhất** và số lần xuất hiện của nó. Nếu có nhiều ký tự cùng xuất hiện nhiều nhất thì chọn ký tự **nhỏ nhất theo thứ tự bảng chữ cái**.

## Dữ liệu vào
Một dòng chứa xâu **s** (1 ≤ |s| ≤ 10⁶).

## Kết quả
In ra ký tự đó và số lần xuất hiện, cách nhau một dấu cách.

## Ví dụ
```input
hocsinhgioi
```
```output
i 3
```

**Giải thích:** `i` xuất hiện 3 lần. `h` và `o` cùng xuất hiện 2 lần.

## Subtask
| Subtask | Điểm | Giới hạn thêm |
|---|---|---|
| 1 | 40 | \|s\| ≤ 1000 |
| 2 | 60 | Không có giới hạn gì thêm |

> **Gợi ý:** Dùng mảng đếm `cnt[26]`: với mỗi ký tự c thì tăng `cnt[c - 'a']`. Khi so sánh để chọn đáp án, nếu số lần **bằng nhau** thì phải giữ ký tự nhỏ hơn.
