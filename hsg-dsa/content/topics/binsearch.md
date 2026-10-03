# Sort & tìm kiếm nhị phân

## 1. Ý nghĩa

**Tìm kiếm nhị phân** dùng để tìm một giá trị trong dãy **đã sắp xếp** bằng cách liên tục **chia đôi** vùng tìm kiếm. Với 10⁹ phần tử, chỉ cần khoảng 30 lần so sánh.

**Ví dụ đời thường:** trò chơi đoán số từ 1 đến 100. Người kia chỉ nói "lớn hơn" hoặc "nhỏ hơn". Cách thông minh là luôn đoán số ở giữa (50, rồi 25 hoặc 75, …), như vậy tối đa 7 lần là ra.

**Chặt nhị phân theo kết quả** là dạng còn hay ra đề hơn. Đề hỏi *"giá trị lớn nhất / nhỏ nhất là bao nhiêu để thỏa điều kiện"*. Thay vì tìm trực tiếp, ta **đoán đáp án X rồi kiểm tra** xem X có được không. Nếu điều kiện **đơn điệu** (X được thì mọi giá trị nhỏ hơn X cũng được) thì có thể chia đôi khoảng đáp án.

## 2. Kiến thức cốt lõi

**Sort:** `sort(a.begin(), a.end())` có độ phức tạp O(n log n). Sắp giảm dần: `sort(a.rbegin(), a.rend())` hoặc dùng `greater<>()`.

**Hai hàm có sẵn của C++ (dãy đã sắp tăng):**

| Hàm | Trả về | Dùng để |
|---|---|---|
| `lower_bound(a.begin(), a.end(), x)` | vị trí đầu tiên có giá trị **≥ x** | tìm x, đếm số phần tử < x |
| `upper_bound(a.begin(), a.end(), x)` | vị trí đầu tiên có giá trị **> x** | đếm số phần tử ≤ x |

- Số phần tử bằng x là `upper_bound(x) − lower_bound(x)`.
- Số phần tử trong đoạn [x, y] là `upper_bound(y) − lower_bound(x)`.
- Muốn đổi vị trí (iterator) ra chỉ số thì trừ đi `a.begin()`.

**Khuôn chặt nhị phân theo kết quả.** Gọi `ok(X)` là hàm kiểm tra "X có được không". Khi đó `ok` có dạng `true true … true false false …`, và ta tìm **X lớn nhất còn true**:

```cpp
long long lo = MIN, hi = MAX, ans = -1;
while (lo <= hi) {
    long long mid = lo + (hi - lo) / 2;
    if (ok(mid)) { ans = mid; lo = mid + 1; }  // được -> thử lớn hơn
    else hi = mid - 1;
}
```

Nếu cần tìm **X nhỏ nhất còn được** (dạng `false … false true … true`) thì đảo lại: khi `ok(mid)` đúng thì `ans = mid; hi = mid − 1`.

[[SIM:bsearch]]

## 3. Dấu hiệu nhận biết trong đề

**Dấu hiệu CÓ:**
- "Có bao nhiêu phần tử ≤ x", "phần tử nhỏ nhất ≥ x", nhiều truy vấn (q tới 10⁵): sort một lần rồi dùng `lower_bound`/`upper_bound`.
- "**Lớn nhất / nhỏ nhất** sao cho…" kèm một điều kiện **dễ kiểm tra** nếu biết trước đáp án: chặt nhị phân theo kết quả. Ví dụ: cắt gỗ, chia đường đi, thời gian ít nhất, khoảng cách lớn nhất.
- Đáp án nằm trong khoảng rất lớn (tới 10⁹–10¹⁸), không duyệt hết được.

> [!WARN] **Dấu hiệu KHÔNG phải dạng này:**
> - Điều kiện **không đơn điệu** (X được, X+1 không, X+2 lại được): chặt nhị phân sẽ cho kết quả sai.
> - Dãy **không được phép sắp xếp** vì thứ tự quan trọng (đoạn con liên tiếp): thường là prefix sum hoặc two pointers.
> - Chỉ có **1 truy vấn** tìm x trong dãy chưa sắp: duyệt O(n) còn nhanh hơn sort O(n log n).

## 4. Độ phức tạp: so sánh với cách trâu

| Bài toán | Cách trâu | Nhị phân |
|---|---|---|
| q truy vấn đếm số trong [x, y] | O(n·q) | O(n log n + q log n) |
| Cắt gỗ: tìm L lớn nhất | thử mọi L: O(max·n) | O(n log max) ≈ 30·n |
| Máy in: thời gian ít nhất | mô phỏng từng bản: O(m log n) | O(n log 10¹⁸) ≈ 60·n |

Bộ nhớ: O(n) để lưu dãy, không tốn thêm.

## 5. Mô phỏng tương tác

Mô phỏng trên (mục 2) cho thấy `lower_bound` chia đôi khoảng ra sao. Mô phỏng dưới đây chặt nhị phân theo kết quả cho bài **Cắt gỗ**. Bạn tự nhập độ dài các khúc gỗ và k, rồi quan sát `lo`, `hi`, `mid` thay đổi.

[[SIM:answer]]

## 6. Code C++ mẫu

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    vector<long long> a(n);
    for (auto &x : a) cin >> x;
    sort(a.begin(), a.end());                            // BẮT BUỘC sort trước

    while (q--) {
        long long x;
        cin >> x;
        // Tự viết lower_bound: vị trí đầu tiên có a[i] >= x (n nếu không có)
        int lo = 0, hi = n;                              // tìm trong [lo, hi)
        while (lo < hi) {
            int mid = (lo + hi) / 2;
            if (a[mid] >= x) hi = mid;                   // mid thỏa -> đáp án ở mid hoặc bên trái
            else lo = mid + 1;                           // mid không thỏa -> bỏ nửa trái
        }
        int pos = lo;
        // Tương đương: int pos = lower_bound(a.begin(), a.end(), x) - a.begin();
        cout << "So phan tu < x: " << pos << '\n';
        if (pos < n && a[pos] == x) cout << "Co x trong day\n";
    }
    return 0;
}
```

## 7. Lỗi hay gặp

- **Quên sort** trước khi dùng `lower_bound` hoặc tự viết nhị phân: kết quả sai mà không báo lỗi gì.
- **Lặp vô hạn:** viết `lo = mid` khi `mid = (lo + hi) / 2` và hi = lo + 1 thì mid = lo mãi mãi. Hãy luôn dùng một trong hai khuôn chuẩn ở trên.
- **Nhầm `lower_bound` với `upper_bound`:** bỏ sót hoặc đếm thừa các phần tử **bằng đúng** đầu mút.
- **Tràn số trong hàm `ok`:** tổng Σ T/tᵢ hoặc Σ aᵢ/L có thể vượt 2·10⁹, thậm chí vượt 9·10¹⁸. Hãy dùng `long long` và **dừng sớm** khi tổng đã đủ.
- **Chọn `hi` quá nhỏ** (đáp án nằm ngoài khoảng tìm) hoặc **`mid = (lo + hi) / 2` bị tràn** khi lo, hi ≈ 10¹⁸. Viết `lo + (hi − lo) / 2` cho an toàn.
- **Quên trường hợp không có đáp án**, ví dụ cắt gỗ không đủ k thanh: phải in 0 hoặc −1 theo yêu cầu đề.

> [!TIP] Khi chặt nhị phân theo kết quả, hãy viết hàm `ok(X)` riêng và thử tay với 2–3 giá trị X trước. Phần lớn lỗi nằm trong `ok`, không nằm ở vòng nhị phân.

## 8. Bài tập

[[PROBLEMS]]
