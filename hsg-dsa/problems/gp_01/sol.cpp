// Đếm vùng - Lời giải chuẩn: loang BFS trên lưới, O(n*m)
// [BƯỚC 1] Biến toàn cục & mảng hướng
// > dx, dy cho 4 hướng; vis đánh dấu ô đã thăm.
#include <bits/stdc++.h>
using namespace std;

int n, m;
vector<string> g;
bool vis[1005][1005];                       // toàn cục: đánh dấu ô đã thăm
const int dx[4] = {-1, 1, 0, 0};            // 4 hướng: lên, xuống, trái, phải
const int dy[4] = {0, 0, -1, 1};

// [BƯỚC 2] Viết hàm BFS loang
// > Cho ô đầu vào queue và đánh dấu ngay. Lấy ô ra, xét 4 ô kề: trong lưới, là '.', chưa thăm thì đánh dấu và push.
void bfs(int sx, int sy) {
    queue<pair<int, int>> q;
    q.push({sx, sy});
    vis[sx][sy] = true;                     // đánh dấu NGAY khi cho vào hàng đợi (tránh thêm trùng)
    while (!q.empty()) {
        auto [x, y] = q.front(); q.pop();
        for (int d = 0; d < 4; d++) {
            int nx = x + dx[d], ny = y + dy[d];
            if (nx < 0 || nx >= n || ny < 0 || ny >= m) continue;   // ra ngoài lưới
            if (g[nx][ny] == '#' || vis[nx][ny]) continue;          // núi hoặc đã thăm
            vis[nx][ny] = true;
            q.push({nx, ny});
        }
    }
}

// [BƯỚC 3] Đọc lưới
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cin >> n >> m;
    g.resize(n);
    for (auto &s : g) cin >> s;
    // [BƯỚC 4] Đếm vùng
    // > Gặp ô '.' chưa thăm thì regions++ và gọi bfs.
    int regions = 0;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            if (g[i][j] == '.' && !vis[i][j]) {   // gặp vùng mới
                regions++;
                bfs(i, j);                       // loang để đánh dấu cả vùng
            }
    // [BƯỚC 5] In kết quả
    cout << regions << '\n';
    return 0;
}
