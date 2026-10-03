// SAI cố ý: biến đếm kiểu int -> tràn khi đáp án > 2^31
// KY_VONG: 40
#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, k; cin >> n >> k;
    vector<int> cnt(k, 0);
    for (int i = 0; i < n; i++) { int a; cin >> a; cnt[a % k]++; }
    int ans = cnt[0] * (cnt[0] - 1) / 2;
    for (int r = 1; r < k - r; r++) ans += cnt[r] * cnt[k - r];
    if (k % 2 == 0 && k > 1) ans += cnt[k / 2] * (cnt[k / 2] - 1) / 2;
    cout << ans << '\n';
}
