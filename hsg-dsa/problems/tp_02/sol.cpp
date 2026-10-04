// Cửa sổ k ngày - Lời giải chuẩn: sliding window, O(n)
// [BƯỚC 1] Khung chương trình
// > Nạp thư viện, viết hàm main và bật đọc/ghi nhanh. Bước này bài nào cũng giống nhau.
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    // [BƯỚC 2] Đọc dữ liệu
    int n, k;
    cin >> n >> k;
    vector<long long> a(n);
    for (auto &x : a) cin >> x;
    // [BƯỚC 3] Tổng cửa sổ đầu tiên
    // > Cộng k phần tử đầu tiên. best khởi tạo bằng tổng này (không phải 0, vì mọi số có thể âm).
    long long sum = 0;
    for (int i = 0; i < k; i++) sum += a[i];   // tổng cửa sổ đầu tiên [0, k-1]
    long long best = sum;                      // KHỞI TẠO bằng cửa sổ đầu, KHÔNG phải 0 (có thể toàn số âm)
    // [BƯỚC 4] Trượt cửa sổ
    // > a[i] vào, a[i − k] ra: sum += a[i] − a[i − k]. Cập nhật best.
    for (int i = k; i < n; i++) {
        sum += a[i] - a[i - k];                // a[i] vào, a[i-k] ra
        best = max(best, sum);
    }
    // [BƯỚC 5] In kết quả
    cout << best << '\n';
    return 0;
}
