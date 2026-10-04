// ƯCLN và BCNN - Lời giải chuẩn: Euclid, O(log) mỗi cặp
// [BƯỚC 1] Khung chương trình
#include <bits/stdc++.h>
using namespace std;

// [BƯỚC 2] Viết hàm Euclid
// > Lặp khi b ≠ 0: (a, b) ← (b, a mod b). Khi b = 0 thì a là ƯCLN.
long long gcd_(long long a, long long b) {
    while (b != 0) {            // gcd(a, b) = gcd(b, a mod b)
        long long r = a % b;
        a = b;
        b = r;
    }
    return a;                   // gcd(a, 0) = a
}

// [BƯỚC 3] Đọc từng cặp
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    cin >> T;
    while (T--) {
        long long a, b;
        cin >> a >> b;
        // [BƯỚC 4] Tính BCNN an toàn
        // > BCNN = a / g * b: chia trước rồi nhân để không tràn số.
        long long g = gcd_(a, b);           // C++17 có sẵn: __gcd(a, b) hoặc gcd(a, b)
        long long l = a / g * b;            // CHIA TRƯỚC rồi nhân: a/g*b <= 1e18, không tràn
        cout << g << ' ' << l << '\n';
    }
    return 0;
}
