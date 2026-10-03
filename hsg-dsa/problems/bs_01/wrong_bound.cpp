// SAI cố ý: dùng lower_bound(y) -> bỏ sót các phần tử bằng đúng y
// KY_VONG: 0
#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, q; cin >> n >> q;
    vector<long long> a(n);
    for (auto &x : a) cin >> x;
    sort(a.begin(), a.end());
    while (q--) {
        long long x, y; cin >> x >> y;
        cout << lower_bound(a.begin(), a.end(), y) - lower_bound(a.begin(), a.end(), x) << '\n';
    }
}
