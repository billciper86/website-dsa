// SAI cố ý: viền ngoài bằng 0 -> khi hàng/cột đầu có số âm, "đi từ ngoài vào" bị coi là có lợi
// KY_VONG: 30
#include <bits/stdc++.h>
using namespace std;
long long f[505][505];
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m; cin >> n >> m;
    for (int i = 1; i <= n; i++) for (int j = 1; j <= m; j++) { long long a; cin >> a; f[i][j] = a + max(f[i - 1][j], f[i][j - 1]); }
    cout << f[n][m] << '\n';
}
