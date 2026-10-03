// Bạn bè - Lời giải chuẩn: đánh số thành phần liên thông bằng BFS, O(n + m + q)
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m, q;
    cin >> n >> m >> q;
    vector<vector<int>> adj(n + 1);          // danh sách kề: adj[u] = các đỉnh kề u
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        adj[a].push_back(b);                 // đồ thị VÔ HƯỚNG: thêm cả 2 chiều
        adj[b].push_back(a);
    }
    vector<int> comp(n + 1, 0);              // comp[v] = mã thành phần của v (0 = chưa thăm)
    int id = 0;
    for (int s = 1; s <= n; s++) {
        if (comp[s]) continue;
        id++;                                // thành phần mới
        queue<int> qu;
        qu.push(s);
        comp[s] = id;
        while (!qu.empty()) {
            int u = qu.front(); qu.pop();
            for (int v : adj[u])
                if (!comp[v]) { comp[v] = id; qu.push(v); }
        }
    }
    while (q--) {
        int u, v;
        cin >> u >> v;
        cout << (comp[u] == comp[v] ? "YES" : "NO") << '\n';
    }
    return 0;
}
