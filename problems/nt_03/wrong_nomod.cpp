// SAI cố ý: không lấy a %= MOD trước -> a*a tràn khi a tới 1e18
// KY_VONG: 60
#include <bits/stdc++.h>
using namespace std;
const long long MOD = 1000000007;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        long long a, b; cin >> a >> b;
        long long r = 1;
        while (b > 0) { if (b & 1) r = r * a % MOD; a = a * a % MOD; b >>= 1; }
        cout << r % MOD << '\n';
    }
}
