// SAI cố ý: tổng tập con kiểu int -> tràn khi nhiều số 1e9
// KY_VONG: 0
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n; long long S; cin >> n >> S;
    vector<int> a(n);
    for (auto &x : a) cin >> x;
    long long cnt = 0;
    for (int mask = 0; mask < (1 << n); mask++) {
        int s = 0;
        for (int i = 0; i < n; i++) if (mask >> i & 1) s += a[i];
        if (s == S) cnt++;
    }
    cout << cnt << '\n';
}
