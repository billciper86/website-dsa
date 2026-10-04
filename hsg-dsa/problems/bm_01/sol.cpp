// Tổng tập con - duyệt mọi tập con bằng bitmask, O(2^n * n)
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n; long long S;
    cin >> n >> S;
    vector<long long> a(n);
    for (auto &x : a) cin >> x;
    long long cnt = 0;
    for (int mask = 0; mask < (1 << n); mask++) {      // mask = 0 là tập rỗng
        long long s = 0;                                // long long: tổng tới 2e10
        for (int i = 0; i < n; i++)
            if (mask >> i & 1) s += a[i];               // bit i bật <=> chọn a[i]
        if (s == S) cnt++;
    }
    cout << cnt << '\n';
}
