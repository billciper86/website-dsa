// SAI cố ý: tham lam - mỗi bạn chọn việc rẻ nhất còn trống
// KY_VONG: 0
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n; cin >> n;
    vector<vector<long long>> c(n, vector<long long>(n));
    for (auto &r : c) for (auto &x : r) cin >> x;
    vector<bool> used(n, false);
    long long s = 0;
    for (int i = 0; i < n; i++) {
        int bj = -1;
        for (int j = 0; j < n; j++) if (!used[j] && (bj < 0 || c[i][j] < c[i][bj])) bj = j;
        used[bj] = true; s += c[i][bj];
    }
    cout << s << '\n';
}
