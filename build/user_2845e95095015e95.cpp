// SAI cố ý: p % k với p âm cho số dư âm -> -1 và k-1 bị coi là khác nhau
// KY_VONG: 30
#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; long long k; cin >> n >> k;
    map<long long, long long> cnt; cnt[0] = 1;
    long long p = 0, ans = 0;
    for (int i = 0; i < n; i++) { long long a; cin >> a; p += a; ans += cnt[p % k]; cnt[p % k]++; }
    cout << ans << '\n';
}
