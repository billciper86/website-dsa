// Đoạn chia hết - prefix sum theo số dư + map, O(n log n)
#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; long long k; cin >> n >> k;
    map<long long, long long> cnt;
    cnt[0] = 1;                                 // p[0] = 0
    long long p = 0, ans = 0;
    for (int i = 0; i < n; i++) {
        long long a; cin >> a;
        p = ((p + a) % k + k) % k;              // số dư luôn trong [0, k-1] kể cả khi a âm
        ans += cnt[p];                          // các p[l-1] cùng số dư với p[r]
        cnt[p]++;
    }
    cout << ans << '\n';
}
