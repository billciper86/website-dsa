// SAI cố ý: số chính phương bị đếm ước căn 2 lần
// KY_VONG: 0
#include <bits/stdc++.h>
using namespace std;
int main() {
    int T; cin >> T;
    while (T--) {
        long long n; cin >> n;
        long long cnt = 0;
        for (long long d = 1; d * d <= n; d++)
            if (n % d == 0) cnt += 2;
        cout << cnt << '\n';
    }
}
