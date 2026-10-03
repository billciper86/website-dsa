// SAI cố ý: biến đếm kiểu int -> tràn khi L nhỏ và tổng số thanh lớn
// KY_VONG: 40
#include <bits/stdc++.h>
using namespace std;
int n; long long k; vector<long long> a;
bool ok(long long L) { int cnt = 0; for (long long x : a) cnt += x / L; return cnt >= k; }
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    cin >> n >> k; a.resize(n);
    for (auto &x : a) cin >> x;
    long long lo = 1, hi = *max_element(a.begin(), a.end()), ans = 0;
    while (lo <= hi) { long long mid = (lo + hi) / 2; if (ok(mid)) { ans = mid; lo = mid + 1; } else hi = mid - 1; }
    cout << ans << '\n';
}
