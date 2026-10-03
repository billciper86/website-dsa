// Đếm đường đi - Lời giải TRÂU: đệ quy thử mọi đường (số đường tới C(18,9) ~ 48620): qua subtask 1
// KY_VONG: 30
#include <bits/stdc++.h>
using namespace std;
int n, m; vector<string> g; long long cnt = 0;
void go(int i, int j) {
    if (i >= n || j >= m || g[i][j] == '#') return;
    if (i == n - 1 && j == m - 1) { cnt++; return; }
    go(i + 1, j); go(i, j + 1);
}
int main() {
    cin >> n >> m; g.resize(n);
    for (auto &s : g) cin >> s;
    go(0, 0);
    cout << cnt % 1000000007 << '\n';
}
