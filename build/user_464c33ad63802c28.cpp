// SAI cố ý: chỉ thêm cạnh 1 chiều (a -> b) -> coi đồ thị vô hướng thành có hướng
// KY_VONG: 0
#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m, q; cin >> n >> m >> q;
    vector<vector<int>> adj(n + 1);
    for (int i = 0; i < m; i++) { int a, b; cin >> a >> b; adj[a].push_back(b); }
    vector<int> comp(n + 1, 0); int id = 0;
    for (int s = 1; s <= n; s++) {
        if (comp[s]) continue;
        id++; queue<int> qu; qu.push(s); comp[s] = id;
        while (!qu.empty()) { int u = qu.front(); qu.pop(); for (int v : adj[u]) if (!comp[v]) { comp[v] = id; qu.push(v); } }
    }
    while (q--) { int u, v; cin >> u >> v; cout << (comp[u] == comp[v] ? "YES" : "NO") << '\n'; }
}
