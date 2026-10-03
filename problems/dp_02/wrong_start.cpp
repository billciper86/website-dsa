// SAI cố ý: luôn đặt f[1][1] = 1 dù ô xuất phát là '#'
// KY_VONG: 0
#include <bits/stdc++.h>
using namespace std;
const long long MOD = 1000000007;
long long f[1005][1005];
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m; cin >> n >> m;
    vector<string> g(n);
    for (auto &s : g) cin >> s;
    f[1][1] = 1;
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++) {
            if (i == 1 && j == 1) continue;
            if (g[i - 1][j - 1] == '#') f[i][j] = 0;
            else f[i][j] = (f[i - 1][j] + f[i][j - 1]) % MOD;
        }
    cout << f[n][m] << '\n';
}
