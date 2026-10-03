// SAI cố ý: duyệt j TĂNG dần -> mỗi món có thể bị lấy nhiều lần (thành bài túi không giới hạn)
// KY_VONG: 0
#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, W; cin >> n >> W;
    vector<long long> dp(W + 1, 0);
    for (int i = 0; i < n; i++) {
        int w; long long v; cin >> w >> v;
        for (int j = w; j <= W; j++) dp[j] = max(dp[j], dp[j - w] + v);
    }
    cout << dp[W] << '\n';
}
