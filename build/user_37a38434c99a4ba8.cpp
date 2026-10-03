// SAI cố ý: chỉ BFS từ ô 'F' đầu tiên tìm được
// KY_VONG: 0
#include <bits/stdc++.h>
using namespace std;
int t_[1005][1005];
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m; cin >> n >> m;
    vector<string> g(n);
    for (auto &s : g) cin >> s;
    queue<pair<int, int>> q; bool first = true;
    for (int i = 0; i < n; i++) for (int j = 0; j < m; j++) {
        t_[i][j] = -1;
        if (g[i][j] == 'F' && first) { t_[i][j] = 0; q.push({i, j}); first = false; }
    }
    int dx[4] = {-1, 1, 0, 0}, dy[4] = {0, 0, -1, 1};
    while (!q.empty()) {
        auto [x, y] = q.front(); q.pop();
        for (int d = 0; d < 4; d++) {
            int nx = x + dx[d], ny = y + dy[d];
            if (nx < 0 || nx >= n || ny < 0 || ny >= m || g[nx][ny] == '#' || t_[nx][ny] != -1) continue;
            t_[nx][ny] = t_[x][y] + 1; q.push({nx, ny});
        }
    }
    int ans = 0;
    for (int i = 0; i < n; i++) for (int j = 0; j < m; j++) if (g[i][j] == '.') { if (t_[i][j] == -1) { cout << -1 << '\n'; return 0; } ans = max(ans, t_[i][j]); }
    cout << ans << '\n';
}
