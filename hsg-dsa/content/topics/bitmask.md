# Bitmask: duyệt tập con & QHĐ trạng thái

## 1. Ý nghĩa

**Bitmask** dùng **một số nguyên** để biểu diễn **một tập con**: bit thứ i bằng 1 nghĩa là phần tử i được chọn. Với n ≤ 20, mọi tập con chính là các số từ 0 đến 2ⁿ − 1, nên duyệt hết chỉ cần **một vòng for**.

**Ví dụ đời thường:** bảng điện có 4 công tắc, mỗi cái bật hoặc tắt. Trạng thái cả bảng có thể ghi bằng 4 chữ số 0/1, ví dụ `1011` (công tắc 0, 1, 3 bật), tức là số 11. Có 2⁴ = 16 trạng thái, đánh số từ 0 đến 15.

Bitmask dùng cho 2 việc:
1. **Thử mọi tập con:** lời giải trâu "vạn năng" để lấy subtask n ≤ 20.
2. **QHĐ trên tập con:** trạng thái là "tập các việc đã làm", ví dụ phân công hay người du lịch. Với n ≤ 20, bài toán trở thành giải được.

## 2. Kiến thức cốt lõi

| Thao tác | Code | Ý nghĩa |
|---|---|---|
| Tập có n phần tử | `1 << n` | 2ⁿ tập con |
| Bit i có bật? | `mask >> i & 1` | phần tử i có trong tập? |
| Bật bit i | `mask \| (1 << i)` | thêm i vào tập |
| Tắt bit i | `mask & ~(1 << i)` | bỏ i khỏi tập |
| Đảo bit i | `mask ^ (1 << i)` | |
| Số phần tử | `__builtin_popcount(mask)` | kích thước tập |
| Bit thấp nhất | `mask & -mask` | |
| Tập đầy đủ | `(1 << n) - 1` | 11…1 |
| Duyệt tập con của mask | `for (s = mask; s; s = (s-1) & mask)` | đọc thêm |

**Khuôn duyệt mọi tập con:**

```cpp
for (int mask = 0; mask < (1 << n); mask++) {     // mask = 0 là tập rỗng
    for (int i = 0; i < n; i++)
        if (mask >> i & 1) { /* phần tử i được chọn */ }
}
```

**QHĐ bitmask (phân công):** dp[mask] là chi phí nhỏ nhất khi các **việc** trong mask đã được giao cho popcount(mask) **người** đầu tiên. Từ dp[mask], người thứ popcount(mask) nhận thêm một việc j chưa có trong mask.

**QHĐ bitmask (người du lịch):** dp[mask][u] là đường ngắn nhất xuất phát từ 0, đã thăm đúng tập mask, đang đứng ở u.

[[SIM:subsets]]

## 3. Dấu hiệu nhận biết trong đề

**Dấu hiệu CÓ:**
- **n ≤ 20** (hoặc n ≤ 15–16 kèm thêm một chiều n), và bài hỏi "chọn một nhóm", "tập con", "phân công", "thứ tự thăm".
- Subtask "n ≤ 10" hoặc "n ≤ 20" trong một bài có n gốc rất lớn: dùng bitmask làm **lời giải trâu** để lấy điểm.
- "Mỗi người làm đúng một việc", "đi qua mỗi điểm đúng một lần": dùng QHĐ bitmask.
- Trạng thái gồm nhiều công tắc bật/tắt (≤ 20 cái).

> [!WARN] **Dấu hiệu KHÔNG phải dạng này:**
> - n tới 100 hoặc 10⁵: 2ⁿ không thể duyệt được. Hãy tìm QHĐ thường hoặc tham lam.
> - Cái túi với W nhỏ: QHĐ theo khối lượng O(n·W) tốt hơn 2ⁿ.
> - Thứ tự **không** quan trọng và chỉ cần đếm: thường có công thức tổ hợp hoặc QHĐ đếm.

## 4. Độ phức tạp: so sánh với cách trâu

| Bài | Trâu | Bitmask |
|---|---|---|
| Tổng tập con | đệ quy chọn/không chọn: O(2ⁿ) | vòng for: O(2ⁿ·n) (ngắn, không đệ quy) |
| Phân công n người | thử mọi hoán vị: O(n!·n), n = 20 là 5·10¹⁹ | O(2ⁿ·n) = 2·10⁷ |
| Người du lịch | thử mọi hoán vị: O(n!), n = 16 là 2·10¹³ | O(2ⁿ·n²) = 1,7·10⁷ |

Bộ nhớ: dp[2ⁿ] (2²⁰ số `long long` = 8 MB) hoặc dp[2ⁿ][n] (2¹⁶·16 = 8 MB). Hãy khai báo **toàn cục**.

## 5. Mô phỏng tương tác

Mô phỏng ở mục 2 duyệt mọi tập con: bạn nhìn từng mask dưới dạng nhị phân, các phần tử được chọn và tổng của chúng.

## 6. Code C++ mẫu

```cpp
#include <bits/stdc++.h>
using namespace std;
long long dp[1 << 20];                           // toàn cục: 8 MB

int main() {
    int n;
    cin >> n;
    vector<vector<long long>> c(n, vector<long long>(n));
    for (auto &r : c) for (auto &x : r) cin >> x;

    // QHĐ bitmask - phân công n người, n việc
    fill(dp, dp + (1 << n), LLONG_MAX);
    dp[0] = 0;
    for (int mask = 0; mask < (1 << n); mask++) {
        if (dp[mask] == LLONG_MAX) continue;
        int i = __builtin_popcount(mask);        // người thứ i đang chờ nhận việc
        if (i == n) continue;
        for (int j = 0; j < n; j++)
            if (!(mask >> j & 1))                // việc j còn trống
                dp[mask | 1 << j] = min(dp[mask | 1 << j], dp[mask] + c[i][j]);
    }
    cout << dp[(1 << n) - 1] << '\n';
    return 0;
}
```

## 7. Lỗi hay gặp

- **`mask <= (1 << n)`**: thừa mask = 2ⁿ (bit n không tồn tại). Phải dùng `<`.
- **Bắt đầu từ `mask = 1`**: bỏ qua tập rỗng, sai khi đề tính cả tập rỗng (ví dụ S = 0).
- **Thứ tự toán tử**: `mask >> i & 1` đúng vì `>>` được tính trước `&`. Nhưng `mask & 1 << i == 0` bị hiểu thành `mask & ((1 << i) == 0)`. Hãy luôn thêm ngoặc: `(mask & (1 << i)) == 0`.
- **`1 << n` với n ≥ 31**: tràn int. Hãy dùng `1LL << n`, và nhớ rằng n lớn thì bitmask vốn đã quá chậm.
- **Tổng tập con kiểu `int`**: 20 số 10⁹ cho tổng 2·10¹⁰.
- **Mảng dp[1 << 20] trong `main`**: tràn stack. Hãy khai báo toàn cục.
- **Người du lịch quên cộng đường quay về 0**, hoặc khởi tạo dp[0][0] thay vì dp[1][0] (tập đã thăm phải chứa sẵn thành phố 0).

> [!TIP] Khi thấy n ≤ 20 trong subtask, hãy nghĩ ngay tới "thử mọi tập con bằng bitmask". Đó là cách trâu nhanh nhất để viết.

## 8. Bài tập

[[PROBLEMS]]
