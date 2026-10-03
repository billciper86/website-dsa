// Đếm ước - Lời giải TRÂU O(n): qua subtask 1
// KY_VONG: 40
#include <bits/stdc++.h>
using namespace std;
int main() {
    int T; cin >> T;
    while (T--) {
        long long n; cin >> n;
        long long cnt = 0;
        for (long long d = 1; d <= n; d++)
            if (n % d == 0) cnt++;
        cout << cnt << '\n';
    }
}
