// Đếm bội số - Lời giải chuẩn O(1) mỗi truy vấn
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);   // đọc/ghi nhanh: bắt buộc khi T lớn
    cin.tie(nullptr);
    int T;
    cin >> T;
    while (T--) {
        long long a, b, k;          // b tới 1e18 -> PHẢI dùng long long (int chỉ tới ~2.1e9)
        cin >> a >> b >> k;
        // Số bội của k trong [1, x] là x / k (chia nguyên).
        // Số bội trong [a, b] = (số bội trong [1, b]) - (số bội trong [1, a-1]).
        cout << b / k - (a - 1) / k << '\n';   // dùng '\n' thay endl cho nhanh
    }
    return 0;
}
