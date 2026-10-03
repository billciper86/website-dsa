// SAI cố ý: two pointers - chỉ đúng khi mọi số dương, sai khi có số âm/0
// KY_VONG: 20
#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; long long K; cin >> n >> K;
    vector<long long> a(n);
    for (auto &x : a) cin >> x;
    long long ans = 0, s = 0;
    int l = 0;
    for (int r = 0; r < n; r++) {
        s += a[r];
        while (l <= r && s > K) s -= a[l++];
        if (s == K && l <= r) ans++;
    }
    cout << ans << '\n';
}
