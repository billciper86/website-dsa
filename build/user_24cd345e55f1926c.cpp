#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    long long K;
    cin >> n >> K;
    map<long long, long long> cnt;  // cnt[x] = số lần tổng tiền tố x đã xuất hiện
    cnt[0] = 1;                     // p[0] = 0 (đoạn bắt đầu từ vị trí 1) - HAY QUÊN!
    long long p = 0, ans = 0;       // ans có thể ~2e10 -> long long
    for (int i = 1; i <= n; i++) {
        long long a;
        cin >> a;
        p += a;                     // p = p[i]
        // Đoạn [l, i] có tổng K  <=>  p[l-1] = p[i] - K
        auto it = cnt.find(p - K);
        if (it != cnt.end()) ans += it->second;
        cnt[p]++;                   // thêm p[i] vào sau khi đếm (để l-1 < i)
    }
    cout << ans << '\n';
    return 0;
}
