// Đoạn chia hết - TRÂU O(n^2)
// KY_VONG: 30
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n; long long k; cin >> n >> k;
    vector<long long> a(n);
    for (auto &x : a) cin >> x;
    long long ans = 0;
    for (int l = 0; l < n; l++) { long long s = 0; for (int r = l; r < n; r++) { s += a[r]; if (s % k == 0) ans++; } }
    cout << ans << '\n';
}
