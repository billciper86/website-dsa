// Đoạn ít màu - Lời giải TRÂU O(n^2 log n): qua subtask 1
// KY_VONG: 40
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, K; cin >> n >> K;
    vector<int> a(n);
    for (auto &x : a) cin >> x;
    int best = 0;
    for (int l = 0; l < n; l++) {
        set<int> s;
        for (int r = l; r < n; r++) {
            s.insert(a[r]);
            if ((int)s.size() > K) break;
            best = max(best, r - l + 1);
        }
    }
    cout << best << '\n';
}
