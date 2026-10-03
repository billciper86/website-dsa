// Tổng đoạn - Lời giải TRÂU O(n*q): qua subtask 1
// KY_VONG: 30
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, q; cin >> n >> q;
    vector<long long> a(n + 1);
    for (int i = 1; i <= n; i++) cin >> a[i];
    while (q--) {
        int l, r; cin >> l >> r;
        long long s = 0;
        for (int i = l; i <= r; i++) s += a[i];   // cộng từng phần tử
        cout << s << '\n';
    }
}
