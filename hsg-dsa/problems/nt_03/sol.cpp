// Lũy thừa modulo - Lời giải chuẩn: lũy thừa nhanh, O(log b)
// [BƯỚC 1] Hằng số MOD
#include <bits/stdc++.h>
using namespace std;

const long long MOD = 1000000007;

// [BƯỚC 2] Hàm lũy thừa nhanh
// > a %= MOD trước tiên. Lặp khi b > 0: nếu bit cuối của b là 1 thì nhân a vào kết quả; bình phương a; b >>= 1.
long long power(long long a, long long b) {
    a %= MOD;                       // QUAN TRỌNG: đưa a về < MOD để a*a < 1e18+... không tràn
    long long res = 1;
    while (b > 0) {
        if (b & 1) res = res * a % MOD;   // bit cuối của b là 1 -> nhân a vào kết quả
        a = a * a % MOD;                  // a -> a^2 -> a^4 -> a^8 ...
        b >>= 1;                          // bỏ bit cuối (chia đôi b)
    }
    return res;                     // b = 0 thì trả về 1 (kể cả a = 0)
}

// [BƯỚC 3] Đọc và in
// > Gọi power(a, b) cho từng cặp.
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    cin >> T;
    while (T--) {
        long long a, b;
        cin >> a >> b;
        cout << power(a, b) << '\n';
    }
    return 0;
}
