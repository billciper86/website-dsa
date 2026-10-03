// Tưới cây - Lời giải TRÂU O(n*m): qua subtask 1
// KY_VONG: 30
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m; cin >> n >> m;
    vector<long long> a(n + 1);
    for (int i = 1; i <= n; i++) cin >> a[i];
    while (m--) {
        int l, r; long long x; cin >> l >> r >> x;
        for (int i = l; i <= r; i++) a[i] += x;   // cộng từng cây
    }
    for (int i = 1; i <= n; i++) cout << a[i] << ' ';
    cout << '\n';
}
