// Bạn bè - Lời giải TRÂU: mỗi câu hỏi BFS lại từ u, O(q * (n + m)): qua subtask 1
// KY_VONG: 40
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m, q; cin >> n >> m >> q;
    vector<vector<int>> adj(n + 1);
    for (int i = 0; i < m; i++) { int a, b; cin >> a >> b; adj[a].push_back(b); adj[b].push_back(a); }
    while (q--) {
        int u, v; cin >> u >> v;
        vector<bool> vis(n + 1, false);
        queue<int> qu; qu.push(u); vis[u] = true;
        while (!qu.empty()) { int x = qu.front(); qu.pop(); for (int y : adj[x]) if (!vis[y]) { vis[y] = true; qu.push(y); } }
        cout << (vis[v] ? "YES" : "NO") << '\n';
    }
}
