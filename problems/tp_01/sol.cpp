// Đoạn dài nhất có tổng <= S - Lời giải chuẩn: two pointers, O(n)
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    long long S;
    cin >> n >> S;
    vector<long long> a(n);
    for (auto &x : a) cin >> x;
    long long sum = 0;          // tổng đoạn [l, r] hiện tại (long long: tới 2e14)
    int l = 0, best = 0;
    for (int r = 0; r < n; r++) {           // đầu phải tiến từng bước
        sum += a[r];                        // thêm a[r] vào cửa sổ
        while (sum > S) {                   // quá S -> bỏ bớt từ bên trái
            sum -= a[l];
            l++;
        }
        best = max(best, r - l + 1);        // [l, r] hợp lệ (có thể rỗng khi l = r + 1)
    }
    cout << best << '\n';
    return 0;
}
