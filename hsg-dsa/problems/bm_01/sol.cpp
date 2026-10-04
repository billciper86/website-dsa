// Tổng tập con - duyệt mọi tập con bằng bitmask, O(2^n * n)
// [BƯỚC 1] Khung chương trình
#include <bits/stdc++.h>
using namespace std;
int main() {
    // [BƯỚC 2] Đọc dữ liệu
    int n; long long S;
    cin >> n >> S;
    vector<long long> a(n);
    for (auto &x : a) cin >> x;
    long long cnt = 0;
    // [BƯỚC 3] Duyệt mọi tập con
    // > mask từ 0 tới 2ⁿ − 1. Bit i bật (mask >> i & 1) thì cộng a[i]. Tổng bằng S thì đếm.
    for (int mask = 0; mask < (1 << n); mask++) {      // mask = 0 là tập rỗng
        long long s = 0;                                // long long: tổng tới 2e10
        for (int i = 0; i < n; i++)
            if (mask >> i & 1) s += a[i];               // bit i bật <=> chọn a[i]
        if (s == S) cnt++;
    }
    // [BƯỚC 4] In kết quả
    cout << cnt << '\n';
}
