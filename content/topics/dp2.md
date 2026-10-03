# Quy hoạch động kinh điển: cái túi, LIS, LCS

## 1. Ý nghĩa

Ba bài toán QHĐ **kinh điển** này xuất hiện dưới rất nhiều "vỏ bọc" khác nhau trong đề thi:

- **Cái túi 0/1:** có giới hạn sức chứa, chọn một số món để giá trị lớn nhất. Ví dụ: chọn môn học sao cho tổng số tiết ≤ 20 mà điểm tích lũy cao nhất, hoặc chọn bài làm trong 180 phút sao cho tổng điểm cao nhất.
- **Dãy con tăng dài nhất (LIS):** chọn nhiều phần tử nhất, giữ thứ tự, mà giá trị tăng dần. Ví dụ: xếp các hộp lồng vào nhau, hoặc tìm số ngày nhiều nhất mà giá cổ phiếu cứ hôm sau cao hơn hôm trước.
- **Xâu con chung dài nhất (LCS):** đo độ giống nhau giữa hai xâu. Ví dụ: so sánh hai đoạn ADN, hoặc tính số thao tác ít nhất để biến xâu này thành xâu kia.

## 2. Kiến thức cốt lõi

**Cái túi 0/1:** dp[j] là giá trị lớn nhất khi tổng khối lượng ≤ j.

> Với mỗi món (w, v): **for j = W giảm về w:** dp[j] = max(dp[j], dp[j − w] + v)

Duyệt j **giảm dần** để dp[j − w] vẫn là giá trị "chưa xét món này", nhờ vậy mỗi món chỉ được lấy **1 lần**. Nếu duyệt j **tăng dần** thì thành bài túi **không giới hạn** số lượng.

**LIS O(n²):** f[i] là độ dài dãy con tăng dài nhất **kết thúc tại i**.

> f[i] = 1 + max{ f[j] : j < i và aⱼ < aᵢ }  (không có j nào thì f[i] = 1)

**LIS O(n log n) (đọc thêm):** giữ mảng `tail[k]` là phần tử cuối **nhỏ nhất** của các dãy con tăng có độ dài k+1. Mảng `tail` luôn tăng dần. Với mỗi x, tìm `lower_bound(tail, x)`: thay phần tử đó bằng x, hoặc thêm x vào cuối. Độ dài LIS bằng `tail.size()`.

**LCS:** f[i][j] là đáp án cho i ký tự đầu của s và j ký tự đầu của t.

> sᵢ = tⱼ ⇒ f[i][j] = f[i−1][j−1] + 1;  ngược lại f[i][j] = max(f[i−1][j], f[i][j−1])

[[SIM:knapsack]]

## 3. Dấu hiệu nhận biết trong đề

**Dấu hiệu CÓ:**
- "Chọn một số món / bài / việc, tổng *khối lượng / thời gian / chi phí* **không vượt quá** W, sao cho tổng *giá trị* lớn nhất", với W ≤ 10⁵–10⁶: dùng **cái túi**.
- "Có thể tạo ra tổng S từ các số đã cho không?" (subset sum) là cái túi với dp kiểu `bool`.
- "Dãy con (không cần liên tiếp) **tăng / giảm** dài nhất", "xếp chồng hộp", "loại bỏ ít phần tử nhất để dãy tăng" (đáp án = n − LIS): dùng **LIS**.
- Hai xâu hoặc hai dãy, hỏi phần **giống nhau** dài nhất, số phép xóa / chèn để biến đổi: dùng **LCS**.

> [!WARN] **Dấu hiệu KHÔNG phải dạng này:**
> - Món đồ **cắt nhỏ được** (lấy một phần): đó là **tham lam** theo tỉ lệ giá trị/khối lượng.
> - W rất lớn (10⁹) nhưng n nhỏ (≤ 20–40): không lập bảng theo W được. Hãy thử mọi tập con, hoặc dùng "meet in the middle" (nâng cao).
> - Đoạn con **liên tiếp** tăng dài nhất: chỉ cần một vòng for đếm, không phải LIS.

## 4. Độ phức tạp: so sánh với cách trâu

| Bài | Trâu | QHĐ | Bộ nhớ |
|---|---|---|---|
| Cái túi 0/1 | thử mọi tập con O(2ⁿ) | O(n·W) | O(W) dùng mảng 1 chiều |
| LIS | O(2ⁿ) | O(n²), hoặc O(n log n) | O(n) |
| LCS | O(2ⁿ·m) | O(n·m) | O(m) nếu chỉ giữ 2 hàng |

## 5. Mô phỏng tương tác

Mô phỏng ở mục 2 điền mảng dp của bài cái túi. Hãy chú ý vì sao j phải chạy **giảm dần**. Mô phỏng dưới đây là LIS O(n²).

[[SIM:lis]]

## 6. Code C++ mẫu

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    // ===== Cái túi 0/1 =====
    int n, W;
    cin >> n >> W;
    vector<long long> dp(W + 1, 0);
    for (int i = 0; i < n; i++) {
        int w; long long v;
        cin >> w >> v;
        for (int j = W; j >= w; j--)                  // GIẢM dần: mỗi món dùng 1 lần
            dp[j] = max(dp[j], dp[j - w] + v);
    }
    cout << dp[W] << '\n';

    // ===== LIS O(n^2) =====
    int m;
    cin >> m;
    vector<long long> a(m);
    for (auto &x : a) cin >> x;
    vector<int> f(m, 1);                              // mỗi phần tử tự nó là dãy dài 1
    int best = 0;
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < i; j++)
            if (a[j] < a[i]) f[i] = max(f[i], f[j] + 1);  // nối a[i] vào sau dãy kết thúc tại j
        best = max(best, f[i]);
    }
    cout << best << '\n';

    // ===== LIS O(n log n) =====
    vector<long long> tail;
    for (long long x : a) {
        auto it = lower_bound(tail.begin(), tail.end(), x);   // tăng NGẶT: lower_bound
        if (it == tail.end()) tail.push_back(x); else *it = x;
    }
    cout << tail.size() << '\n';
    return 0;
}
```

## 7. Lỗi hay gặp

- **Cái túi duyệt j tăng dần**: một món bị lấy nhiều lần.
- **Dùng tham lam cho cái túi 0/1**: sai. Ví dụ W = 10 với các món (6, 30), (5, 20), (5, 20). Tham lam chọn món tỉ lệ cao (6, 30) được 30, còn tối ưu là 2 món (5, 20) được 40.
- **Tổng giá trị dùng `int`**: 100 món × 10⁹ thì tràn số.
- **LIS: nhầm `lower_bound` với `upper_bound`**: `upper_bound` tính dãy **không giảm** (cho phép bằng nhau).
- **LIS: khởi tạo f[i] = 0** thay vì 1, hoặc lấy đáp án là f[n−1] thay vì **max** của mọi f[i].
- **LCS bảng 5000×5000 `long long`** = 200 MB, gần chạm giới hạn. Hãy dùng `int` hoặc chỉ giữ 2 hàng.
- **Mảng dp lớn khai báo trong `main`** dưới dạng mảng tĩnh: tràn stack. Hãy dùng `vector` hoặc khai báo toàn cục.

> [!TIP] Bài LIS ở đây có 3 subtask: trâu (20 điểm) → O(n²) (70 điểm) → O(n log n) (100 điểm). Trong phòng thi, **viết O(n²) trước để chắc 70 điểm**, còn thời gian mới nâng cấp.

## 8. Bài tập

[[PROBLEMS]]
