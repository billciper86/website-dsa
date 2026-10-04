// Người du lịch - TRÂU: thử mọi thứ tự thăm các thành phố 1..n-1, O(n! * n)
// KY_VONG: 40
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n; cin >> n;
    vector<vector<long long>> d(n, vector<long long>(n));
    for (auto &r : d) for (auto &x : r) cin >> x;
    vector<int> p;
    for (int i = 1; i < n; i++) p.push_back(i);
    long long best = LLONG_MAX;
    do {
        long long s = d[0][p[0]];
        for (int i = 0; i + 1 < (int)p.size(); i++) s += d[p[i]][p[i + 1]];
        s += d[p.back()][0];
        best = min(best, s);
    } while (next_permutation(p.begin(), p.end()));
    cout << best << '\n';
}
