// Cửa sổ k ngày - Lời giải chuẩn: sliding window, O(n)
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, k;
    cin >> n >> k;
    vector<long long> a(n);
    for (auto &x : a) cin >> x;
    long long sum = 0;
    for (int i = 0; i < k; i++) sum += a[i];   // tổng cửa sổ đầu tiên [0, k-1]
    long long best = sum;                      // KHỞI TẠO bằng cửa sổ đầu, KHÔNG phải 0 (có thể toàn số âm)
    for (int i = k; i < n; i++) {
        sum += a[i] - a[i - k];                // a[i] vào, a[i-k] ra
        best = max(best, sum);
    }
    cout << best << '\n';
    return 0;
}
