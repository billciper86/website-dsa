// SAI cố ý: tham lam - mỗi lần nhảy tới hòn có chênh lệch độ cao nhỏ nhất
// KY_VONG: 0
#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, K; cin >> n >> K;
    vector<long long> h(n + 1);
    for (int i = 1; i <= n; i++) cin >> h[i];
    long long total = 0;
    int i = 1;
    while (i < n) {
        int bj = i + 1;
        for (int j = i + 1; j <= min(n, i + K); j++)
            if (llabs(h[i] - h[j]) < llabs(h[i] - h[bj])) bj = j;
        total += llabs(h[i] - h[bj]);
        i = bj;
    }
    cout << total << '\n';
}
