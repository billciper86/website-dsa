// Lũy thừa modulo - Lời giải TRÂU: nhân b lần, O(b): qua subtask 1
// KY_VONG: 30
#include <bits/stdc++.h>
using namespace std;
const long long MOD = 1000000007;
int main() {
    int T; cin >> T;
    while (T--) {
        long long a, b; cin >> a >> b;
        a %= MOD;
        long long r = 1;
        for (long long i = 0; i < b; i++) r = r * a % MOD;
        cout << r << '\n';
    }
}
