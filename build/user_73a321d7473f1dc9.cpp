// Kho báu - TRÂU: đệ quy thử mọi đường (tối đa C(18,9) đường)
// KY_VONG: 30
#include <bits/stdc++.h>
using namespace std;
int n, m; vector<vector<long long>> a; long long best = LLONG_MIN;
void go(int i, int j, long long s) {
    s += a[i][j];
    if (i == n - 1 && j == m - 1) { best = max(best, s); return; }
    if (i + 1 < n) go(i + 1, j, s);
    if (j + 1 < m) go(i, j + 1, s);
}
int main() {
    cin >> n >> m; a.assign(n, vector<long long>(m));
    for (auto &r : a) for (auto &x : r) cin >> x;
    go(0, 0, 0);
    cout << best << '\n';
}
