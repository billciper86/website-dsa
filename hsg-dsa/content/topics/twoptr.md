# Two pointers & sliding window

## 1. Ý nghĩa

**Two pointers (hai con trỏ)** dùng hai chỉ số **l** và **r** cùng chạy trên dãy, **không bao giờ lùi lại**. Nhờ vậy, những bài phải xét mọi đoạn con [l, r] (O(n²)) giảm xuống còn **O(n)**.

**Sliding window (cửa sổ trượt)** là trường hợp đặc biệt: đoạn [l, r] giống như một khung cửa sổ trượt dần sang phải. Mỗi bước có một phần tử **vào** cửa sổ và có thể có phần tử **ra** khỏi cửa sổ.

**Ví dụ đời thường:** bạn đọc một dãy bài báo và muốn tìm nhiều bài liên tiếp nhất mà đọc hết không quá 60 phút. Bạn đọc thêm bài tiếp theo (r tăng). Nếu quá 60 phút thì bỏ bớt bài cũ nhất ở đầu (l tăng). Bạn không bao giờ phải quay lại đọc từ đầu.

## 2. Kiến thức cốt lõi

**Khuôn mẫu "cửa sổ co giãn"** (đoạn dài nhất hoặc ngắn nhất thỏa điều kiện):

```cpp
int l = 0;
for (int r = 0; r < n; r++) {
    them(a[r]);                     // đưa a[r] vào cửa sổ
    while (cửa sổ [l, r] KHÔNG hợp lệ) {
        bot(a[l]);                  // đưa a[l] ra
        l++;
    }
    // [l, r] là đoạn hợp lệ dài nhất kết thúc tại r
    best = max(best, r - l + 1);
}
```

**Vì sao chỉ O(n)?** Mỗi phần tử được **thêm vào đúng 1 lần** (khi r đi qua) và **bỏ ra nhiều nhất 1 lần** (khi l đi qua). Tổng số thao tác ≤ 2n, dù trong code có vòng `while` lồng bên trong vòng `for`.

**Điều kiện dùng được:** điều kiện phải **"đơn điệu"**. Nếu đoạn [l, r] hợp lệ thì mọi đoạn con bên trong nó cũng hợp lệ. Ví dụ "tổng ≤ S" với số **dương**, hoặc "≤ K màu khác nhau".

**Cửa sổ cố định k phần tử:** `sum += a[i] − a[i−k]`, mỗi bước O(1).

**Hai con trỏ từ hai đầu** (dãy đã sort): tìm cặp có tổng bằng X bằng cách đặt l = 0, r = n−1. Nếu a[l] + a[r] < X thì l++, nếu lớn hơn thì r−−.

[[SIM:window]]

## 3. Dấu hiệu nhận biết trong đề

**Dấu hiệu CÓ:**
- "Đoạn con **liên tiếp** dài nhất / ngắn nhất sao cho…" với điều kiện như tổng ≤ S (số dương), không quá K giá trị khác nhau, không có phần tử trùng.
- "Tổng / trung bình của **k phần tử liên tiếp**", "cửa sổ độ dài k".
- "Đếm số đoạn con thỏa…": với mỗi r, mọi l' từ l đến r đều hợp lệ, nên cộng thêm r − l + 1 vào kết quả.
- Dãy đã sort và tìm **cặp** có tổng bằng / gần nhất với X.
- n ≤ 2·10⁵ trong khi cách trâu là O(n²).

> [!WARN] **Dấu hiệu KHÔNG phải dạng này:**
> - Dãy có **số âm** và điều kiện về tổng (tổng ≤ S, tổng = K): khi thêm phần tử thì tổng có thể giảm, nên tính đơn điệu bị phá. Hãy dùng **prefix sum + map** (xem bài Đếm đoạn có tổng K).
> - Dãy con **không liên tiếp**: thường là QHĐ hoặc tham lam.
> - Cần **max/min trong mỗi cửa sổ**: cần deque đơn điệu (nâng cao hơn). Với subtask nhỏ thì làm trâu.

## 4. Độ phức tạp: so sánh với cách trâu

| Bài toán | Cách trâu | Two pointers |
|---|---|---|
| Đoạn dài nhất tổng ≤ S | O(n²) | O(n) |
| Tổng lớn nhất k phần tử liên tiếp | O(n·k) | O(n) |
| Đoạn dài nhất ≤ K màu | O(n² log n) | O(n log n) với map |

Bộ nhớ: O(1) thêm, hoặc O(n) nếu dùng map đếm.

## 5. Mô phỏng tương tác

Mô phỏng ở mục 2 chạy bài "đoạn dài nhất có tổng ≤ S". Hãy quan sát: con trỏ **l** chỉ tiến, không bao giờ lùi. Thử nhập một dãy có số rất lớn để thấy cửa sổ co lại về 0 phần tử.

## 6. Code C++ mẫu

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n; long long S;
    cin >> n >> S;
    vector<long long> a(n);
    for (auto &x : a) cin >> x;

    // 1) Đoạn dài nhất có tổng <= S (mọi a[i] > 0)
    long long sum = 0;
    int l = 0, best = 0;
    for (int r = 0; r < n; r++) {
        sum += a[r];                      // a[r] vào
        while (sum > S) sum -= a[l++];    // quá S: a[l] ra, l tiến
        best = max(best, r - l + 1);
    }
    cout << best << '\n';

    // 2) Đếm số đoạn có tổng <= S: với mỗi r, các đoạn [l..r], [l+1..r], ..., [r..r] đều hợp lệ
    long long dem = 0; sum = 0; l = 0;
    for (int r = 0; r < n; r++) {
        sum += a[r];
        while (sum > S) sum -= a[l++];
        dem += r - l + 1;                 // long long: có thể tới n(n+1)/2 ~ 2e10
    }
    cout << dem << '\n';
    return 0;
}
```

## 7. Lỗi hay gặp

- **Dùng two pointers khi có số âm**: tính đơn điệu bị phá, cho kết quả sai. Hãy kiểm tra giới hạn aᵢ ≥ 1 trong đề.
- **Khởi tạo `best = 0`** trong bài cửa sổ cố định khi mọi số âm: đáp án phải là số âm. Hãy khởi tạo bằng cửa sổ đầu tiên hoặc `LLONG_MIN`.
- **Quên xóa phần tử có số đếm về 0 khỏi `map`**: `cnt.size()` vẫn đếm cả màu đã ra khỏi cửa sổ.
- **Tổng cửa sổ kiểu `int`**: k phần tử 10⁹ thì tràn ngay.
- **Đếm số đoạn bằng biến `int`**: số đoạn có thể tới n(n+1)/2 ≈ 2·10¹⁰.
- **Quên trường hợp cửa sổ rỗng**: khi một phần tử đơn lẻ đã > S thì l = r + 1, độ dài 0. Code vẫn đúng nếu dùng `while (sum > S)` như mẫu.

> [!TIP] Muốn kiểm tra lời giải two pointers: viết thêm bản trâu O(n²) (chỉ 5 dòng), sinh 1000 dãy ngẫu nhiên nhỏ và so sánh kết quả. Xem cách làm ở chủ đề *Chiến thuật*.

## 8. Bài tập

[[PROBLEMS]]
