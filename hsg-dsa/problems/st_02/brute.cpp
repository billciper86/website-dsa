// Xâu đối xứng dài nhất - Lời giải TRÂU O(n^3): thử mọi xâu con: qua subtask 1
// KY_VONG: 30
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s; cin >> s;
    int n = s.size(), best = 0;
    for (int l = 0; l < n; l++)
        for (int r = l; r < n; r++) {
            bool ok = true;
            for (int i = l, j = r; i < j; i++, j--) if (s[i] != s[j]) { ok = false; break; }
            if (ok) best = max(best, r - l + 1);
        }
    cout << best << '\n';
}
