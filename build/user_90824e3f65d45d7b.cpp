// Xếp hàng - Lời giải TRÂU: thử mọi hoán vị (next_permutation), O(n! * n): qua subtask 1
// KY_VONG: 20
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n; cin >> n;
    vector<long long> t(n);
    for (auto &x : t) cin >> x;
    sort(t.begin(), t.end());          // next_permutation cần bắt đầu từ dãy tăng
    long long best = LLONG_MAX;
    do {
        long long now = 0, total = 0;
        for (long long x : t) { now += x; total += now; }
        best = min(best, total);
    } while (next_permutation(t.begin(), t.end()));
    cout << best << '\n';
}
