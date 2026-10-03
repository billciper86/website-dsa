// SAI cố ý: ghép 2 người đứng cạnh nhau sau khi sort (tham lam sai)
// KY_VONG: 0
#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; long long C; cin >> n >> C;
    vector<long long> w(n);
    for (auto &x : w) cin >> x;
    sort(w.begin(), w.end());
    int boats = 0;
    for (int i = 0; i < n; ) {
        if (i + 1 < n && w[i] + w[i + 1] <= C) i += 2; else i++;
        boats++;
    }
    cout << boats << '\n';
}
