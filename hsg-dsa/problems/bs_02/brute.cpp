// Cắt gỗ - Lời giải TRÂU: thử mọi L từ lớn xuống nhỏ, O(max(a) * n): qua subtask 1
// KY_VONG: 40
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n; long long k; cin >> n >> k;
    vector<long long> a(n);
    for (auto &x : a) cin >> x;
    long long mx = *max_element(a.begin(), a.end());
    for (long long L = mx; L >= 1; L--) {
        long long cnt = 0;
        for (long long x : a) cnt += x / L;
        if (cnt >= k) { cout << L << '\n'; return 0; }
    }
    cout << 0 << '\n';
}
