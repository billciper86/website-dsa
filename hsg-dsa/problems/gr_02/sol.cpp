// Xếp hàng - Lời giải chuẩn: tham lam, người nhanh làm trước, O(n log n)
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<long long> t(n);
    for (auto &x : t) cin >> x;
    sort(t.begin(), t.end());            // thời gian tăng dần
    long long now = 0, total = 0;        // long long: tổng tới ~2e16
    for (long long x : t) {
        now += x;                        // thời điểm người này làm xong
        total += now;
    }
    cout << total << '\n';
    return 0;
}
