// Đếm ước - Lời giải chuẩn O(sqrt(n)) mỗi số
#include <bits/stdc++.h>
using namespace std;

int main() {
    int T;
    cin >> T;
    while (T--) {
        long long n;
        cin >> n;
        long long cnt = 0;
        // d chạy tới sqrt(n). Viết d * d <= n (KHÔNG dùng sqrt() vì sai số số thực).
        // d phải là long long: d*d tới 1e12 sẽ tràn nếu d là int.
        for (long long d = 1; d * d <= n; d++) {
            if (n % d == 0) {
                cnt++;                    // ước d
                if (d != n / d) cnt++;    // ước n/d (khác d thì mới đếm thêm)
            }
        }
        cout << cnt << '\n';
    }
    return 0;
}
