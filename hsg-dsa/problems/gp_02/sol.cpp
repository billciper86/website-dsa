// Mê cung - Lời giải chuẩn: BFS tìm đường ngắn nhất trên lưới, O(n*m)
// [BƯỚC 1] Mảng khoảng cách
// > dist = −1 nghĩa là chưa thăm.
#include <bits/stdc++.h>
using namespace std;

int dist_[1005][1005];          // dist_[x][y] = số bước ít nhất từ S tới (x, y); -1 = chưa thăm

// [BƯỚC 2] Đọc lưới, tìm S và T
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;
    vector<string> g(n);
    for (auto &s : g) cin >> s;
    int sx = 0, sy = 0, tx = 0, ty = 0;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++) {
            dist_[i][j] = -1;
            if (g[i][j] == 'S') { sx = i; sy = j; }
            if (g[i][j] == 'T') { tx = i; ty = j; }
        }
    // [BƯỚC 3] BFS từ S
    // > dist[S] = 0. Mỗi ô kề hợp lệ chưa thăm: dist = dist[u] + 1 rồi push. Tới T thì dừng.
    const int dx[4] = {-1, 1, 0, 0}, dy[4] = {0, 0, -1, 1};
    queue<pair<int, int>> q;
    dist_[sx][sy] = 0;
    q.push({sx, sy});
    while (!q.empty()) {
        auto [x, y] = q.front(); q.pop();
        if (x == tx && y == ty) break;                 // tới đích rồi: dừng sớm
        for (int d = 0; d < 4; d++) {
            int nx = x + dx[d], ny = y + dy[d];
            if (nx < 0 || nx >= n || ny < 0 || ny >= m) continue;
            if (g[nx][ny] == '#' || dist_[nx][ny] != -1) continue;
            dist_[nx][ny] = dist_[x][y] + 1;           // lớp sau = lớp trước + 1
            q.push({nx, ny});
        }
    }
    // [BƯỚC 4] In kết quả
    // > −1 nếu không tới được.
    cout << dist_[tx][ty] << '\n';                     // -1 nếu không tới được
    return 0;
}
