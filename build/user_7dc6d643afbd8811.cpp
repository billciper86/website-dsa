// SAI cố ý: cộng hết không dừng sớm -> tổng vượt long long khi T lớn, nhiều máy nhanh
// KY_VONG: 30
#include <bits/stdc++.h>
using namespace std;
int n; long long m; vector<long long> t;
bool ok(long long T) { long long cnt = 0; for (long long x : t) cnt += T / x; return cnt >= m; }
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    cin >> n >> m; t.resize(n);
    for (auto &x : t) cin >> x;
    long long lo = 1, hi = (long long)1e18;
    while (lo < hi) { long long mid = lo + (hi - lo) / 2; if (ok(mid)) hi = mid; else lo = mid + 1; }
    cout << lo << '\n';
}
