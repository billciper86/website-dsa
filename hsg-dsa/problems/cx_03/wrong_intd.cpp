// SAI cố ý: biến d kiểu int -> d*d tràn khi n lớn (vòng lặp chạy sai/không dừng)
// KY_VONG: 40
#include <bits/stdc++.h>
using namespace std;
int main() {
    int T; cin >> T;
    while (T--) {
        long long n; cin >> n;
        long long cnt = 0;
        for (int d = 1; d * d <= n; d++)
            if (n % d == 0) { cnt++; if (d != n / d) cnt++; }
        cout << cnt << '\n';
    }
}
