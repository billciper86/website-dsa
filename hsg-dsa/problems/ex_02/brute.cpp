// Chuồng bò - TRÂU: thử mọi d từ lớn xuống nhỏ, O(max(x) * n)
// KY_VONG: 30
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, c; cin >> n >> c;
    vector<long long> x(n);
    for (auto &v : x) cin >> v;
    sort(x.begin(), x.end());
    for (long long d = x[n - 1] - x[0]; d >= 1; d--) {
        int cnt = 1; long long last = x[0];
        for (int i = 1; i < n; i++) if (x[i] - last >= d) { cnt++; last = x[i]; }
        if (cnt >= c) { cout << d << '\n'; return 0; }
    }
    cout << 0 << '\n';
}
