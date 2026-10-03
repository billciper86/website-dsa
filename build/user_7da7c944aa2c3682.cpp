// Chuồng bò - sort + chặt nhị phân kết quả + tham lam kiểm tra, O(n log n + n log 1e9)
#include <bits/stdc++.h>
using namespace std;
int n, c;
vector<long long> x;
bool ok(long long d) {                    // đặt được c con với khoảng cách >= d không?
    int cnt = 1; long long last = x[0];   // tham lam: con đầu ở chuồng trái nhất
    for (int i = 1; i < n; i++)
        if (x[i] - last >= d) { cnt++; last = x[i]; if (cnt >= c) return true; }
    return cnt >= c;
}
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    cin >> n >> c; x.resize(n);
    for (auto &v : x) cin >> v;
    sort(x.begin(), x.end());
    long long lo = 1, hi = x[n - 1] - x[0], ans = 0;
    while (lo <= hi) {
        long long mid = (lo + hi) / 2;
        if (ok(mid)) { ans = mid; lo = mid + 1; } else hi = mid - 1;
    }
    cout << ans << '\n';
}
