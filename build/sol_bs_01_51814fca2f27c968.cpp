// Đếm số trong khoảng - Lời giải chuẩn: sort + lower_bound/upper_bound, O((n + q) log n)
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    vector<long long> a(n);
    for (auto &x : a) cin >> x;
    sort(a.begin(), a.end());                 // nhị phân CHỈ dùng được trên dãy đã sắp xếp
    while (q--) {
        long long x, y;
        cin >> x >> y;
        // lower_bound(x): vị trí đầu tiên có giá trị >= x
        // upper_bound(y): vị trí đầu tiên có giá trị >  y
        auto L = lower_bound(a.begin(), a.end(), x);
        auto R = upper_bound(a.begin(), a.end(), y);
        cout << (R - L) << '\n';               // số phần tử trong [x, y]
    }
    return 0;
}
