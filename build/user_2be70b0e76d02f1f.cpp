// Đếm bội số - Lời giải TRÂU O(b - a) mỗi truy vấn: chỉ qua subtask 1
// KY_VONG: 40
#include <bits/stdc++.h>
using namespace std;

int main() {
    int T;
    cin >> T;
    while (T--) {
        long long a, b, k;
        cin >> a >> b >> k;
        long long cnt = 0;
        for (long long x = a; x <= b; x++)   // duyệt từng số trong đoạn
            if (x % k == 0) cnt++;
        cout << cnt << '\n';
    }
    return 0;
}
