// SAI cố ý: quên sắp xếp tọa độ
// KY_VONG: 0
#include <bits/stdc++.h>
using namespace std;
int n, c; vector<long long> x;
bool ok(long long d) { int cnt = 1; long long last = x[0]; for (int i = 1; i < n; i++) if (x[i] - last >= d) { cnt++; last = x[i]; } return cnt >= c; }
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    cin >> n >> c; x.resize(n);
    for (auto &v : x) cin >> v;
    long long lo = 1, hi = 1000000000, ans = 0;
    while (lo <= hi) { long long mid = (lo + hi) / 2; if (ok(mid)) { ans = mid; lo = mid + 1; } else hi = mid - 1; }
    cout << ans << '\n';
}
