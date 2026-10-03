// SAI cố ý: quên cộng lại góc S[x1-1][y1-1] (bị trừ 2 lần)
// KY_VONG: 0
#include <bits/stdc++.h>
using namespace std;
long long S[505][505];
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m, q; cin >> n >> m >> q;
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++) { long long a; cin >> a; S[i][j] = a + S[i - 1][j] + S[i][j - 1] - S[i - 1][j - 1]; }
    while (q--) {
        int x1, y1, x2, y2; cin >> x1 >> y1 >> x2 >> y2;
        cout << S[x2][y2] - S[x1 - 1][y2] - S[x2][y1 - 1] << '\n';
    }
}
