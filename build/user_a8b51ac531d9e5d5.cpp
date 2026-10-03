// SAI cố ý: tổng cửa sổ kiểu int -> tràn khi các số lớn
// KY_VONG: 0
#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; long long S; cin >> n >> S;
    vector<int> a(n);
    for (auto &x : a) cin >> x;
    int sum = 0, l = 0, best = 0;
    for (int r = 0; r < n; r++) {
        sum += a[r];
        while (sum > S) sum -= a[l++];
        best = max(best, r - l + 1);
    }
    cout << best << '\n';
}
