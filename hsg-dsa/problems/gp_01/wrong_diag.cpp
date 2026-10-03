// SAI cố ý: loang cả 8 hướng (tính cả ô chéo) -> gộp nhầm các vùng chỉ chạm góc
// KY_VONG: 0
#include <bits/stdc++.h>
using namespace std;
int n, m; vector<string> g; bool vis[1005][1005];
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    cin >> n >> m; g.resize(n);
    for (auto &s : g) cin >> s;
    int regions = 0;
    for (int i = 0; i < n; i++) for (int j = 0; j < m; j++) {
        if (g[i][j] != '.' || vis[i][j]) continue;
        regions++;
        queue<pair<int, int>> q; q.push({i, j}); vis[i][j] = true;
        while (!q.empty()) {
            auto [x, y] = q.front(); q.pop();
            for (int a = -1; a <= 1; a++) for (int b = -1; b <= 1; b++) {
                int nx = x + a, ny = y + b;
                if (nx < 0 || nx >= n || ny < 0 || ny >= m || g[nx][ny] == '#' || vis[nx][ny]) continue;
                vis[nx][ny] = true; q.push({nx, ny});
            }
        }
    }
    cout << regions << '\n';
}
