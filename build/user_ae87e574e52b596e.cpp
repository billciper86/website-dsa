// Phân công - TRÂU: thử mọi hoán vị, O(n! * n)
// KY_VONG: 40
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n; cin >> n;
    vector<vector<long long>> c(n, vector<long long>(n));
    for (auto &r : c) for (auto &x : r) cin >> x;
    vector<int> p(n);
    iota(p.begin(), p.end(), 0);                    // p[i] = việc giao cho bạn i
    long long best = LLONG_MAX;
    do {
        long long s = 0;
        for (int i = 0; i < n; i++) s += c[i][p[i]];
        best = min(best, s);
    } while (next_permutation(p.begin(), p.end()));
    cout << best << '\n';
}
