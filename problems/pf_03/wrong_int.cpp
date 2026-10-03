// SAI cố ý: dùng int -> tràn khi nhiều lần cộng x = 1e9
// KY_VONG: 30
#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m; cin >> n >> m;
    vector<int> a(n + 1), d(n + 2, 0);
    for (int i = 1; i <= n; i++) cin >> a[i];
    while (m--) { int l, r, x; cin >> l >> r >> x; d[l] += x; d[r + 1] -= x; }
    int add = 0;
    for (int i = 1; i <= n; i++) { add += d[i]; cout << a[i] + add << ' '; }
    cout << '\n';
}
