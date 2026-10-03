Có **n** người cần qua sông, người thứ i nặng **wᵢ** kg. Mỗi thuyền chở được **tối đa 2 người** và tổng cân nặng **không vượt quá C** kg. Biết mỗi người đều nhẹ hơn hoặc bằng C.

Hỏi cần **ít nhất** bao nhiêu chuyến thuyền?

## Dữ liệu vào
- Dòng 1: hai số nguyên **n, C** (1 ≤ n ≤ 2·10⁵, 1 ≤ C ≤ 10⁹).
- Dòng 2: n số nguyên w₁ … wₙ (1 ≤ wᵢ ≤ C).

## Kết quả
Một số nguyên là số chuyến ít nhất.

## Ví dụ
```input
5 10
7 2 5 3 8
```
```output
3
```

**Giải thích:** ghép (8, 2), (7, 3) và để 5 đi một mình: tổng cộng 3 chuyến.

## Subtask
| Subtask | Điểm | Giới hạn thêm |
|---|---|---|
| 1 | 30 | n ≤ 12 |
| 2 | 70 | Không có giới hạn gì thêm |

> **Gợi ý:** Sắp xếp cân nặng. Người **nặng nhất** chắc chắn phải đi một chuyến. Hãy cho người đó đi cùng người **nhẹ nhất** nếu được, còn không thì người nặng nhất đi một mình. Hai con trỏ chạy từ hai đầu dãy.
