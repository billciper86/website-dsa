// SAI cố ý: tham lam theo tỉ lệ giá trị / khối lượng (chỉ đúng với túi "cắt nhỏ được")
// KY_VONG: 0
#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; long long W; cin >> n >> W;
    vector<pair<long long, long long>> it(n);
    for (auto &p : it) cin >> p.first >> p.second;
    sort(it.begin(), it.end(), [](auto &a, auto &b) { return (__int128)a.second * b.first > (__int128)b.second * a.first; });
    long long sw = 0, sv = 0;
    for (auto &[w, v] : it) if (sw + w <= W) { sw += w; sv += v; }
    cout << sv << '\n';
}
