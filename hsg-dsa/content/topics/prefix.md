# Prefix sum 1D/2D & mảng hiệu

## 1. Ý nghĩa

**Prefix sum (mảng cộng dồn)** giúp trả lời rất nhanh câu hỏi *"tổng các phần tử từ vị trí l đến r là bao nhiêu?"*. Mỗi câu hỏi chỉ mất **1 phép trừ**, thay vì phải cộng lại từ đầu.

**Ví dụ đời thường:** đồng hồ công-tơ-mét của xe máy luôn ghi tổng số km đã chạy. Muốn biết từ thứ Hai đến thứ Sáu bạn chạy bao nhiêu km, bạn không cần cộng từng ngày, chỉ cần lấy số km tối thứ Sáu trừ số km tối Chủ nhật.

**Mảng hiệu** làm điều ngược lại: *"cộng thêm x cho mọi phần tử từ l đến r"* chỉ bằng 2 phép. Ví dụ: tưới cho cả đoạn cây, tăng lương cho cả nhóm nhân viên liên tiếp, hoặc đếm số khách có mặt trong khách sạn mỗi ngày.

**Prefix 2D** mở rộng ý tưởng này lên bảng 2 chiều: tính tổng của một hình chữ nhật bất kỳ trong O(1).

## 2. Kiến thức cốt lõi

**Prefix 1D:** đặt `p[0] = 0` và `p[i] = p[i−1] + a[i]`, tức p[i] là tổng i phần tử đầu tiên.

> **Tổng đoạn [l, r] = p[r] − p[l − 1]**

Lý do: p[r] là tổng a₁…aᵣ, còn p[l−1] là tổng a₁…aₗ₋₁. Lấy hiệu thì phần đầu bị trừ hết, chỉ còn lại aₗ…aᵣ.

**Mảng hiệu:** muốn cộng x vào mọi a[i] với l ≤ i ≤ r:

> **d[l] += x;  d[r + 1] −= x;**

Sau khi xử lý hết các cập nhật, phần tử a[i] được cộng thêm đúng **d[1] + d[2] + … + d[i]** (cộng dồn của d). Nói cách khác, mảng hiệu là "phép ngược" của prefix sum.

**Prefix 2D:** S[i][j] là tổng hình chữ nhật từ (1,1) đến (i,j).

> **S[i][j] = a[i][j] + S[i−1][j] + S[i][j−1] − S[i−1][j−1]**
>
> **Tổng (x₁,y₁)–(x₂,y₂) = S[x₂][y₂] − S[x₁−1][y₂] − S[x₂][y₁−1] + S[x₁−1][y₁−1]**

Đây là nguyên lý *bao hàm – loại trừ*: phần chồng lên nhau bị trừ 2 lần nên phải cộng lại 1 lần.

**Kỹ thuật đi kèm hay gặp:** đếm số đoạn có tổng bằng K. Tổng đoạn [l, r] bằng K tương đương với **p[l−1] = p[r] − K**. Duyệt r từ trái sang phải, dùng `map` để đếm xem giá trị p[r] − K đã xuất hiện bao nhiêu lần trước đó.

## 3. Dấu hiệu nhận biết trong đề

**Dấu hiệu CÓ:**
- "Tính tổng các phần tử từ vị trí l đến r", với **nhiều truy vấn** (q tới 10⁵).
- "Đoạn con liên tiếp có tổng…", "dãy con liên tiếp", "đếm số đoạn có tổng bằng / chia hết cho K".
- "Tăng / giảm tất cả phần tử trong đoạn [l, r]" nhiều lần, **cuối cùng mới hỏi** kết quả: dùng mảng hiệu.
- "Tổng hình chữ nhật con", "vùng đất k×k có tổng lớn nhất" trên lưới: dùng prefix 2D.
- Giới hạn n, q ≤ 10⁵–10⁶ (O(n·q) chắc chắn TLE).

> [!WARN] **Dấu hiệu KHÔNG phải dạng này:**
> - Cập nhật và hỏi **xen kẽ nhau** ("cộng x vào đoạn rồi hỏi tổng đoạn, lặp lại"): mảng tĩnh không xử lý được, cần cây Fenwick/segment tree. Nếu q nhỏ thì làm trâu để lấy subtask.
> - Hỏi **max/min** của đoạn: max không trừ được như tổng, nên prefix không dùng được (cần sparse table hoặc deque).
> - Dãy con **không liên tiếp** (chọn phần tử tùy ý): thường là bài QHĐ hoặc tham lam.
> - Dãy toàn số **dương** và hỏi đoạn có tổng ≤ S: two pointers đơn giản hơn (Ngày 1 chiều).

## 4. Độ phức tạp: so sánh với cách trâu

| Bài toán | Cách trâu | Dùng prefix / mảng hiệu | Bộ nhớ thêm |
|---|---|---|---|
| q truy vấn tổng đoạn | O(n·q) = 4·10¹⁰ phép, **TLE** | O(n + q) | O(n) |
| m lần cộng đoạn | O(n·m) | O(n + m) | O(n) |
| q truy vấn tổng hình chữ nhật | O(q·n·m) | O(n·m + q) | O(n·m) |
| Đếm đoạn có tổng K | O(n²) (qua subtask n ≤ 5000) | O(n log n) với `map` | O(n) |

## 5. Mô phỏng tương tác

Bạn có thể tự sửa dãy số và truy vấn rồi bấm **Nạp dữ liệu**. Dùng phím ← → để đi từng bước, phím Space để chạy hoặc dừng.

[[SIM:prefix1d]]

[[SIM:diff]]

[[SIM:prefix2d]]

## 6. Code C++ mẫu

**Prefix 1D + truy vấn tổng đoạn:**

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    vector<long long> p(n + 1, 0);        // p[0] = 0; dùng long long vì tổng có thể > 2e9
    for (int i = 1; i <= n; i++) {        // chỉ số từ 1 cho khớp công thức
        long long x;
        cin >> x;
        p[i] = p[i - 1] + x;              // tổng i phần tử đầu
    }
    while (q--) {
        int l, r;
        cin >> l >> r;
        cout << p[r] - p[l - 1] << '\n';  // l - 1, KHÔNG phải l
    }
    return 0;
}
```

**Mảng hiệu:**

```cpp
vector<long long> d(n + 2, 0);            // n + 2 vì có thể ghi vào d[r + 1] = d[n + 1]
for (int k = 0; k < m; k++) {
    int l, r; long long x;
    cin >> l >> r >> x;
    d[l] += x;                            // từ l trở đi cộng x
    d[r + 1] -= x;                        // từ r + 1 trở đi trừ lại
}
long long add = 0;
for (int i = 1; i <= n; i++) {
    add += d[i];                          // tổng lượng được cộng vào vị trí i
    a[i] += add;
}
```

**Prefix 2D:**

```cpp
long long S[1005][1005];                  // mảng toàn cục: mặc định bằng 0, không tràn stack
// dựng
for (int i = 1; i <= n; i++)
    for (int j = 1; j <= m; j++)
        S[i][j] = a[i][j] + S[i - 1][j] + S[i][j - 1] - S[i - 1][j - 1];
// truy vấn hình (x1, y1) - (x2, y2)
long long ans = S[x2][y2] - S[x1 - 1][y2] - S[x2][y1 - 1] + S[x1 - 1][y1 - 1];
```

**Đếm đoạn có tổng bằng K:**

```cpp
map<long long, long long> cnt;
cnt[0] = 1;                               // p[0] = 0 đã "xuất hiện" (đoạn bắt đầu từ 1)
long long p = 0, ans = 0;
for (int i = 1; i <= n; i++) {
    p += a[i];
    if (cnt.count(p - K)) ans += cnt[p - K];   // số l-1 có p[l-1] = p[i] - K
    cnt[p]++;
}
```

## 7. Lỗi hay gặp

- **Viết p[r] − p[l] thay vì p[r] − p[l−1]**: thiếu phần tử aₗ. Hãy luôn thử lại với đoạn 1 phần tử (l = r).
- **Mảng p kiểu `int`**: 2·10⁵ số, mỗi số tới 10⁹, tổng tới 2·10¹⁴ thì tràn. Mảng cộng dồn **luôn dùng long long**.
- **Mảng hiệu khai báo cỡ n + 1** rồi ghi vào d[r+1] với r = n: vượt chỉ số. Hãy khai báo n + 2.
- **Trừ ở d[r] thay vì d[r+1]**: phần tử r không được cộng.
- **Prefix 2D quên cộng lại góc** S[x₁−1][y₁−1], hoặc trộn lẫn chỉ số hàng/cột (x là hàng, y là cột).
- **Mảng 2D lớn khai báo trong `main`** (ví dụ `long long S[1000][1000]` là 8 MB): dễ tràn stack gây RE. Hãy khai báo **toàn cục**.
- **Đếm đoạn tổng K quên `cnt[0] = 1`**: bỏ sót mọi đoạn bắt đầu từ vị trí 1.
- **Dùng 0-index và 1-index lẫn lộn**: chọn một kiểu cho cả bài. Với prefix sum, 1-index là dễ nhất.

> [!TIP] Mẹo kiểm tra nhanh: tự tạo dãy `1 2 3 4 5` và truy vấn `(1,1)`, `(5,5)`, `(1,5)`. Đáp án đúng phải là 1, 5, 15.

## 8. Bài tập

[[PROBLEMS]]
