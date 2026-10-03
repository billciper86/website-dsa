// Đếm số trong khoảng - Lời giải TRÂU O(n*q): qua subtask 1
// KY_VONG: 40
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, q; cin >> n >> q;
    vector<long long> a(n);
    for (auto &x : a) cin >> x;
    while (q--) {
        long long x, y; cin >> x >> y;
        int cnt = 0;
        for (int i = 0; i < n; i++)
            if (x <= a[i] && a[i] <= y) cnt++;
        cout << cnt << '\n';
    }
}
