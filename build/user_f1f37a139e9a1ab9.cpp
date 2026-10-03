// SAI cố ý: trừ ở d[r] thay vì d[r+1] -> cây r không được cộng
// KY_VONG: 0
#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m; cin >> n >> m;
    vector<long long> a(n + 1), d(n + 2, 0);
    for (int i = 1; i <= n; i++) cin >> a[i];
    while (m--) { int l, r; long long x; cin >> l >> r >> x; d[l] += x; d[r] -= x; }
    long long add = 0;
    for (int i = 1; i <= n; i++) { add += d[i]; cout << a[i] + add << ' '; }
    cout << '\n';
}
