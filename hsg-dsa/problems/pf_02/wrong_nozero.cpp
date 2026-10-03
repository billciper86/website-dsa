// SAI cố ý: quên cnt[0] = 1 -> bỏ sót các đoạn bắt đầu từ vị trí 1
// KY_VONG: 0
#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; long long K; cin >> n >> K;
    map<long long, long long> cnt;
    long long p = 0, ans = 0;
    for (int i = 1; i <= n; i++) {
        long long a; cin >> a; p += a;
        if (cnt.count(p - K)) ans += cnt[p - K];
        cnt[p]++;
    }
    cout << ans << '\n';
}
