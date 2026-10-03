// Đoạn con tổng lớn nhất - Lời giải chuẩn: Kadane (QHĐ), O(n)
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<long long> a(n);
    for (auto &x : a) cin >> x;
    long long cur = a[0];       // cur = f[i]: tổng lớn nhất của đoạn KẾT THÚC tại i
    long long best = a[0];      // khởi tạo bằng a[0], KHÔNG phải 0 (đoạn phải khác rỗng)
    for (int i = 1; i < n; i++) {
        cur = max(a[i], cur + a[i]);   // bắt đầu đoạn mới tại i, hoặc nối dài đoạn cũ
        best = max(best, cur);
    }
    cout << best << '\n';
    return 0;
}
