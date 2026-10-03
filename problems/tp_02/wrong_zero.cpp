// SAI cố ý: khởi tạo best = 0 -> sai khi mọi cửa sổ đều có tổng âm
// KY_VONG: 0
#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, k; cin >> n >> k;
    vector<long long> a(n);
    for (auto &x : a) cin >> x;
    long long sum = 0, best = 0;
    for (int i = 0; i < n; i++) {
        sum += a[i];
        if (i >= k) sum -= a[i - k];
        if (i >= k - 1) best = max(best, sum);
    }
    cout << best << '\n';
}
