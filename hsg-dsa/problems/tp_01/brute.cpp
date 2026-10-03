// Đoạn dài nhất có tổng <= S - Lời giải TRÂU O(n^2): qua subtask 1
// KY_VONG: 40
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n; long long S; cin >> n >> S;
    vector<long long> a(n);
    for (auto &x : a) cin >> x;
    int best = 0;
    for (int l = 0; l < n; l++) {
        long long sum = 0;
        for (int r = l; r < n; r++) {
            sum += a[r];
            if (sum > S) break;             // số dương: cộng thêm chỉ làm tổng tăng
            best = max(best, r - l + 1);
        }
    }
    cout << best << '\n';
}
