// Cửa sổ k ngày - Lời giải TRÂU O(n*k): qua subtask 1
// KY_VONG: 40
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k; cin >> n >> k;
    vector<long long> a(n);
    for (auto &x : a) cin >> x;
    long long best = LLONG_MIN;
    for (int l = 0; l + k <= n; l++) {
        long long s = 0;
        for (int i = l; i < l + k; i++) s += a[i];
        best = max(best, s);
    }
    cout << best << '\n';
}
