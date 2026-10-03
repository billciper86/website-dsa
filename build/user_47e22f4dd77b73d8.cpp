// ƯCLN và BCNN - Lời giải TRÂU: thử ước từ min(a,b) xuống, O(min(a,b)): qua subtask 1
// KY_VONG: 30
#include <bits/stdc++.h>
using namespace std;
int main() {
    int T; cin >> T;
    while (T--) {
        long long a, b; cin >> a >> b;
        long long g = 1;
        for (long long d = min(a, b); d >= 1; d--)
            if (a % d == 0 && b % d == 0) { g = d; break; }
        cout << g << ' ' << a / g * b << '\n';
    }
}
