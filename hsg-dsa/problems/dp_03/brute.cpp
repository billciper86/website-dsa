// Ếch nhảy - Lời giải TRÂU: đệ quy thử mọi cách nhảy (số cách tăng theo hàm mũ): qua subtask 1
// KY_VONG: 20
#include <bits/stdc++.h>
using namespace std;
int n, K; vector<long long> h;
long long go(int i) {                       // sức lực nhỏ nhất từ hòn i tới hòn n
    if (i == n) return 0;
    long long best = LLONG_MAX;
    for (int j = i + 1; j <= min(n, i + K); j++)
        best = min(best, llabs(h[i] - h[j]) + go(j));
    return best;
}
int main() {
    cin >> n >> K; h.resize(n + 1);
    for (int i = 1; i <= n; i++) cin >> h[i];
    cout << go(1) << '\n';
}
