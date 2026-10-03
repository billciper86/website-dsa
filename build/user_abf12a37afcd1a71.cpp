// Mê cung - Lời giải TRÂU: lặp "cập nhật khoảng cách từ ô kề" tới khi không đổi (kiểu Bellman-Ford): qua subtask 1
// KY_VONG: 40
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m; cin >> n >> m;
    vector<string> g(n);
    for (auto &s : g) cin >> s;
    const int INF = 1e9;
    vector<vector<int>> d(n, vector<int>(m, INF));
    int tx = 0, ty = 0;
    for (int i = 0; i < n; i++) for (int j = 0; j < m; j++) {
        if (g[i][j] == 'S') d[i][j] = 0;
        if (g[i][j] == 'T') { tx = i; ty = j; }
    }
    bool changed = true;
    while (changed) {
        changed = false;
        for (int i = 0; i < n; i++) for (int j = 0; j < m; j++) {
            if (g[i][j] == '#') continue;
            int dx[4] = {-1, 1, 0, 0}, dy[4] = {0, 0, -1, 1};
            for (int k = 0; k < 4; k++) {
                int x = i + dx[k], y = j + dy[k];
                if (x >= 0 && x < n && y >= 0 && y < m && d[x][y] + 1 < d[i][j]) { d[i][j] = d[x][y] + 1; changed = true; }
            }
        }
    }
    cout << (d[tx][ty] >= INF ? -1 : d[tx][ty]) << '\n';
}
