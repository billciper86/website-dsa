// SAI cố ý: quên trường hợp k chẵn, dư k/2 ghép với chính nó
// KY_VONG: 0
#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, k; cin >> n >> k;
    vector<long long> cnt(k, 0);
    for (int i = 0; i < n; i++) { long long a; cin >> a; cnt[a % k]++; }
    long long ans = cnt[0] * (cnt[0] - 1) / 2;
    for (int r = 1; r < k - r; r++) ans += cnt[r] * cnt[k - r];
    cout << ans << '\n';
}
