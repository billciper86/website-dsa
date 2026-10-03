// Đếm vùng - Lời giải TRÂU: gán nhãn rồi lặp "lan nhãn nhỏ nhất sang ô kề" tới khi không đổi: qua subtask 1
// KY_VONG: 40
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m; cin >> n >> m;
    vector<string> g(n);
    for (auto &s : g) cin >> s;
    vector<vector<int>> lab(n, vector<int>(m, -1));
    for (int i = 0; i < n; i++) for (int j = 0; j < m; j++) if (g[i][j] == '.') lab[i][j] = i * m + j;
    bool changed = true;
    while (changed) {                           // mỗi vòng O(n*m), số vòng có thể tới O(n*m)
        changed = false;
        for (int i = 0; i < n; i++) for (int j = 0; j < m; j++) {
            if (lab[i][j] < 0) continue;
            int dx[4] = {-1, 1, 0, 0}, dy[4] = {0, 0, -1, 1};
            for (int d = 0; d < 4; d++) {
                int x = i + dx[d], y = j + dy[d];
                if (x >= 0 && x < n && y >= 0 && y < m && lab[x][y] >= 0 && lab[x][y] < lab[i][j]) { lab[i][j] = lab[x][y]; changed = true; }
            }
        }
    }
    set<int> s;
    for (auto &r : lab) for (int x : r) if (x >= 0) s.insert(x);
    cout << s.size() << '\n';
}
