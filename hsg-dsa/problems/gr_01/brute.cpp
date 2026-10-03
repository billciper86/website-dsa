// Lịch họp - Lời giải TRÂU: thử mọi tập con, O(2^n * n log n): qua subtask 1
// KY_VONG: 30
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n; cin >> n;
    vector<pair<long long, long long>> m(n);
    for (auto &p : m) cin >> p.first >> p.second;
    sort(m.begin(), m.end());                         // sort theo giờ bắt đầu để kiểm tra nhanh
    int best = 0;
    for (int mask = 0; mask < (1 << n); mask++) {
        long long lastEnd = -1; bool ok = true; int c = 0;
        for (int i = 0; i < n && ok; i++)
            if (mask >> i & 1) {
                if (m[i].first < lastEnd) ok = false;
                lastEnd = m[i].second; c++;
            }
        if (ok) best = max(best, c);
    }
    cout << best << '\n';
}
