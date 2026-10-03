// Cháy rừng - TRÂU: mô phỏng từng phút, mỗi phút quét cả lưới, O(n*m*số phút)
// KY_VONG: 40
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m; cin >> n >> m;
    vector<string> g(n);
    for (auto &s : g) cin >> s;
    int minute = 0;
    while (true) {
        vector<string> h = g; bool changed = false;
        for (int i = 0; i < n; i++) for (int j = 0; j < m; j++) {
            if (g[i][j] != '.') continue;
            if ((i > 0 && g[i-1][j] == 'F') || (i + 1 < n && g[i+1][j] == 'F') || (j > 0 && g[i][j-1] == 'F') || (j + 1 < m && g[i][j+1] == 'F')) { h[i][j] = 'F'; changed = true; }
        }
        if (!changed) break;
        g = h; minute++;
    }
    for (auto &s : g) if (s.find('.') != string::npos) { cout << -1 << '\n'; return 0; }
    cout << minute << '\n';
}
