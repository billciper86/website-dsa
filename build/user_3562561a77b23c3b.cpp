// Đếm đường đi trên lưới - Lời giải chuẩn: QHĐ 2 chiều, O(n*m)
#include <bits/stdc++.h>
using namespace std;

const long long MOD = 1000000007;
long long f[1005][1005];     // toàn cục: tự bằng 0, hàng 0 / cột 0 làm "viền" bằng 0

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;
    vector<string> g(n);
    for (auto &s : g) cin >> s;
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++) {
            if (g[i - 1][j - 1] == '#') { f[i][j] = 0; continue; }   // ô cấm: không có đường nào
            if (i == 1 && j == 1) { f[i][j] = 1; continue; }         // ô xuất phát (đã chắc chắn là '.')
            f[i][j] = (f[i - 1][j] + f[i][j - 1]) % MOD;             // từ trên xuống + từ trái sang
        }
    cout << f[n][m] << '\n';
    return 0;
}
