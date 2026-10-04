// Đếm đoạn có tổng K - Lời giải TRÂU O(n^2) dùng prefix sum: qua subtask 1, 2
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n; long long K; cin >> n >> K;
    vector<long long> p(n + 1, 0);
    for (int i = 1; i <= n; i++) { long long a; cin >> a; p[i] = p[i - 1] + a; }
    long long ans = 0;
    for (int l = 1; l <= n; l++)
        for (int r = l; r <= n; r++)
            if (p[r] - p[l - 1] == K) ans++;
    cout << ans << '\n';
}