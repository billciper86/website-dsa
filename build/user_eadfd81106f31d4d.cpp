// Người du lịch (TSP) - QHĐ bitmask: dp[mask][u] = thời gian nhỏ nhất xuất phát từ 0,
// đã thăm đúng tập mask, đang đứng ở u. O(2^n * n^2)
#include <bits/stdc++.h>
using namespace std;
long long dp[1 << 16][16];
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; cin >> n;
    vector<vector<long long>> d(n, vector<long long>(n));
    for (auto &r : d) for (auto &x : r) cin >> x;
    const long long INF = LLONG_MAX / 4;
    for (int m = 0; m < (1 << n); m++) for (int u = 0; u < n; u++) dp[m][u] = INF;
    dp[1][0] = 0;                                         // mới ở thành phố 0, tập đã thăm = {0}
    for (int mask = 1; mask < (1 << n); mask++)
        for (int u = 0; u < n; u++) {
            if (!(mask >> u & 1) || dp[mask][u] >= INF) continue;
            for (int v = 0; v < n; v++)
                if (!(mask >> v & 1)) {                   // đi tiếp tới thành phố v chưa thăm
                    int nm = mask | (1 << v);
                    dp[nm][v] = min(dp[nm][v], dp[mask][u] + d[u][v]);
                }
        }
    int full = (1 << n) - 1;
    long long ans = INF;
    for (int u = 1; u < n; u++) ans = min(ans, dp[full][u] + d[u][0]);   // quay về 0
    cout << ans << '\n';
}
