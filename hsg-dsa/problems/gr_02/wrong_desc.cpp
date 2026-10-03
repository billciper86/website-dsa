// SAI cố ý: cho người làm LÂU nhất lên trước
// KY_VONG: 0
#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; cin >> n;
    vector<long long> t(n);
    for (auto &x : t) cin >> x;
    sort(t.rbegin(), t.rend());
    long long now = 0, total = 0;
    for (long long x : t) { now += x; total += now; }
    cout << total << '\n';
}
