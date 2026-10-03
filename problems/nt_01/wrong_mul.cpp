// SAI cố ý: tính BCNN = a * b / g -> tích a*b tràn long long khi a, b lớn
// KY_VONG: 60
#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        long long a, b; cin >> a >> b;
        long long g = __gcd(a, b);
        cout << g << ' ' << a * b / g << '\n';
    }
}
