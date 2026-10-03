// Tổng đoạn - Lời giải chuẩn: mảng cộng dồn, O(n + q)
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    vector<long long> p(n + 1, 0);       // p[0] = 0, chỉ số từ 1 cho dễ
    for (int i = 1; i <= n; i++) {
        long long a;
        cin >> a;
        p[i] = p[i - 1] + a;             // p[i] = a1 + ... + ai (long long: tới 2e14)
    }
    while (q--) {
        int l, r;
        cin >> l >> r;
        cout << p[r] - p[l - 1] << '\n'; // tổng [l, r] = p[r] - p[l-1]  (chú ý l-1!)
    }
    return 0;
}
