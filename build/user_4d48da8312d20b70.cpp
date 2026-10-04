// SAI cố ý: tham lam "láng giềng gần nhất" - luôn đi tới thành phố chưa thăm gần nhất
// KY_VONG: 0
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n; cin >> n;
    vector<vector<long long>> d(n, vector<long long>(n));
    for (auto &r : d) for (auto &x : r) cin >> x;
    vector<bool> vis(n, false); vis[0] = true;
    int u = 0; long long s = 0;
    for (int step = 1; step < n; step++) {
        int bv = -1;
        for (int v = 0; v < n; v++) if (!vis[v] && (bv < 0 || d[u][v] < d[u][bv])) bv = v;
        s += d[u][bv]; vis[bv] = true; u = bv;
    }
    cout << s + d[u][0] << '\n';
}
