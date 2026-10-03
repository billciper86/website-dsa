// SAI cố ý: biến đếm đáp án kiểu int (khi mọi số = 0 và K = 0, đáp án ~2e10)
// KY_VONG: 70
#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; long long K; cin >> n >> K;
    map<long long, int> cnt; cnt[0] = 1;
    long long p = 0; int ans = 0;
    for (int i = 1; i <= n; i++) {
        long long a; cin >> a; p += a;
        if (cnt.count(p - K)) ans += cnt[p - K];
        cnt[p]++;
    }
    cout << ans << '\n';
}
