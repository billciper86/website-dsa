// SAI cố ý: tổng kiểu int -> tràn khi n và t lớn
// KY_VONG: 50
#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; cin >> n;
    vector<int> t(n);
    for (auto &x : t) cin >> x;
    sort(t.begin(), t.end());
    int now = 0, total = 0;
    for (int x : t) { now += x; total += now; }
    cout << total << '\n';
}
