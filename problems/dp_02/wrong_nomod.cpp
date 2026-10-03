// SAI cố ý: không mod -> số đường đi tràn long long khi lưới lớn
// KY_VONG: 30
#include <bits/stdc++.h>
using namespace std;
long long f[1005][1005];
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m; cin >> n >> m;
    vector<string> g(n);
    for (auto &s : g) cin >> s;
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++) {
            if (g[i - 1][j - 1] == '#') f[i][j] = 0;
            else if (i == 1 && j == 1) f[i][j] = 1;
            else f[i][j] = f[i - 1][j] + f[i][j - 1];
        }
    cout << f[n][m] % 1000000007 << '\n';
}
