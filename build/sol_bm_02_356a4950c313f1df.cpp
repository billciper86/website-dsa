// Phân công - QHĐ bitmask: dp[mask] = chi phí nhỏ nhất khi các việc trong mask đã giao
// cho popcount(mask) bạn đầu tiên. O(2^n * n)
#include <bits/stdc++.h>
using namespace std;
long long dp[1 << 20];
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; cin >> n;
    vector<vector<long long>> c(n, vector<long long>(n));
    for (auto &r : c) for (auto &x : r) cin >> x;
    int full = (1 << n) - 1;
    fill(dp, dp + (1 << n), LLONG_MAX);
    dp[0] = 0;
    for (int mask = 0; mask < full; mask++) {
        if (dp[mask] == LLONG_MAX) continue;
        int i = __builtin_popcount(mask);              // bạn tiếp theo cần được giao việc
        for (int j = 0; j < n; j++)
            if (!(mask >> j & 1)) {                     // việc j chưa ai làm
                int nm = mask | (1 << j);
                dp[nm] = min(dp[nm], dp[mask] + c[i][j]);
            }
    }
    cout << dp[full] << '\n';
}
