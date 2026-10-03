// LIS - Lời giải TRÂU: thử mọi dãy con, O(2^n * n): qua subtask 1
// KY_VONG: 20
#include <bits/stdc++.h>
using namespace std;
int n; vector<long long> a; int best = 0;
void go(int i, long long last, int len) {       // xét phần tử i, phần tử cuối đã chọn là last
    if (i == n) { best = max(best, len); return; }
    if (len + (n - i) <= best) return;          // có lấy hết cũng không hơn: dừng
    if (a[i] > last) go(i + 1, a[i], len + 1);  // chọn a[i]
    go(i + 1, last, len);                       // không chọn
}
int main() {
    cin >> n; a.resize(n);
    for (auto &x : a) cin >> x;
    go(0, LLONG_MIN, 0);
    cout << best << '\n';
}
