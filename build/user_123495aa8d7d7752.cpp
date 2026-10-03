// Tổng hình chữ nhật - Lời giải TRÂU O(q*n*m): qua subtask 1
// KY_VONG: 30
#include <bits/stdc++.h>
using namespace std;
long long a[505][505];
int main() {
    int n, m, q; cin >> n >> m >> q;
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++) cin >> a[i][j];
    while (q--) {
        int x1, y1, x2, y2; cin >> x1 >> y1 >> x2 >> y2;
        long long s = 0;
        for (int i = x1; i <= x2; i++)
            for (int j = y1; j <= y2; j++) s += a[i][j];
        cout << s << '\n';
    }
}
