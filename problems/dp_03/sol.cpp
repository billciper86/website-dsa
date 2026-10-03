// Ếch nhảy - Lời giải chuẩn: QHĐ 1 chiều, O(n*K)
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, K;
    cin >> n >> K;
    vector<long long> h(n + 1);
    for (int i = 1; i <= n; i++) cin >> h[i];
    vector<long long> f(n + 1, LLONG_MAX);   // f[i] = sức lực nhỏ nhất để tới hòn i
    f[1] = 0;                                // đứng sẵn ở hòn 1: không tốn gì
    for (int i = 2; i <= n; i++)
        for (int j = max(1, i - K); j < i; j++)          // nhảy từ hòn j (cách i không quá K) tới i
            f[i] = min(f[i], f[j] + llabs(h[j] - h[i]));
    cout << f[n] << '\n';
    return 0;
}
