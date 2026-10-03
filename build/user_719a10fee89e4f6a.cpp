// SAI cố ý: dùng DFS (stack) thay vì BFS (queue) -> đường tìm được KHÔNG chắc ngắn nhất
// KY_VONG: 0
#include <bits/stdc++.h>
using namespace std;
int dist_[1005][1005];
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m; cin >> n >> m;
    vector<string> g(n);
    for (auto &s : g) cin >> s;
    int sx = 0, sy = 0, tx = 0, ty = 0;
    for (int i = 0; i < n; i++) for (int j = 0; j < m; j++) {
        dist_[i][j] = -1;
        if (g[i][j] == 'S') { sx = i; sy = j; }
        if (g[i][j] == 'T') { tx = i; ty = j; }
    }
    int dx[4] = {-1, 1, 0, 0}, dy[4] = {0, 0, -1, 1};
    stack<pair<int, int>> st;
    dist_[sx][sy] = 0; st.push({sx, sy});
    while (!st.empty()) {
        auto [x, y] = st.top(); st.pop();
        for (int d = 0; d < 4; d++) {
            int nx = x + dx[d], ny = y + dy[d];
            if (nx < 0 || nx >= n || ny < 0 || ny >= m || g[nx][ny] == '#' || dist_[nx][ny] != -1) continue;
            dist_[nx][ny] = dist_[x][y] + 1; st.push({nx, ny});
        }
    }
    cout << dist_[tx][ty] << '\n';
}
