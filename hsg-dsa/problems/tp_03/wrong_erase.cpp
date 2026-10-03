// SAI cố ý: quên xóa màu có số lần = 0 khỏi map -> cnt.size() đếm cả màu đã ra khỏi cửa sổ
// KY_VONG: 0
#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, K; cin >> n >> K;
    vector<int> a(n);
    for (auto &x : a) cin >> x;
    map<int, int> cnt;
    int l = 0, best = 0;
    for (int r = 0; r < n; r++) {
        cnt[a[r]]++;
        while ((int)cnt.size() > K && l <= r) { cnt[a[l]]--; l++; }
        best = max(best, r - l + 1);
    }
    cout << best << '\n';
}
