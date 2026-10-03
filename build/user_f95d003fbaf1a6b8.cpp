// SAI cố ý: tham lam theo giờ BẮT ĐẦU sớm nhất (có phản ví dụ)
// KY_VONG: 0
#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; cin >> n;
    vector<pair<long long, long long>> m(n);
    for (auto &p : m) cin >> p.first >> p.second;
    sort(m.begin(), m.end());
    long long lastEnd = -1; int cnt = 0;
    for (auto &[s, e] : m) if (s >= lastEnd) { cnt++; lastEnd = e; }
    cout << cnt << '\n';
}
