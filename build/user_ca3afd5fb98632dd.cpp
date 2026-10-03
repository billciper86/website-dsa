// Lời giải SAI cố ý: quên trừ 1 (b/k - a/k) -> sai khi a là bội của k
// KY_VONG: 0
#include <bits/stdc++.h>
using namespace std;
int main() {
    int T; cin >> T;
    while (T--) { long long a, b, k; cin >> a >> b >> k; cout << b / k - a / k << '\n'; }
}
