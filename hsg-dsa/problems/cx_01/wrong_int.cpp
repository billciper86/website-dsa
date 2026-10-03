// Lời giải SAI cố ý: dùng int -> tràn số ở subtask 3
// KY_VONG: 70
#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        long long a, b, k; cin >> a >> b >> k;
        int ans = b / k - (a - 1) / k;   // lỗi: kết quả có thể tới 1e18
        cout << ans << '\n';
    }
}
