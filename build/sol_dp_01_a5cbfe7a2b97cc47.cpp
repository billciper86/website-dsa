// Đoạn con tổng lớn nhất - Lời giải chuẩn: Kadane (QHĐ), O(n)
// [BƯỚC 1] Khung chương trình
// > Nạp thư viện, viết hàm main và bật đọc/ghi nhanh. Bước này bài nào cũng giống nhau.
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    // [BƯỚC 2] Đọc dãy
    int n;
    cin >> n;
    vector<long long> a(n);
    for (auto &x : a) cin >> x;
    // [BƯỚC 3] Khởi tạo bằng phần tử đầu
    // > cur = tổng lớn nhất của đoạn kết thúc tại i. Đoạn phải khác rỗng nên khởi tạo bằng a[0], không phải 0.
    long long cur = a[0];       // cur = f[i]: tổng lớn nhất của đoạn KẾT THÚC tại i
    long long best = a[0];      // khởi tạo bằng a[0], KHÔNG phải 0 (đoạn phải khác rỗng)
    // [BƯỚC 4] Công thức Kadane
    // > cur = max(a[i], cur + a[i]): bắt đầu lại tại i hoặc nối tiếp. best = max(best, cur).
    for (int i = 1; i < n; i++) {
        cur = max(a[i], cur + a[i]);   // bắt đầu đoạn mới tại i, hoặc nối dài đoạn cũ
        best = max(best, cur);
    }
    // [BƯỚC 5] In kết quả
    cout << best << '\n';
    return 0;
}
