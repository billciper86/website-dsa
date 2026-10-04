// SAI cố ý: mask bắt đầu từ 1 -> bỏ qua tập rỗng (sai khi S = 0)
// KY_VONG: 0
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n; long long S; cin >> n >> S;
    vector<long long> a(n);
    for (auto &x : a) cin >> x;
    long long cnt = 0;
    for (int mask = 1; mask < (1 << n); mask++) {
        long long s = 0;
        for (int i = 0; i < n; i++) if (mask >> i & 1) s += a[i];
        if (s == S) cnt++;
    }
    cout << cnt << '\n';
}
