// Đếm số nguyên tố - Lời giải TRÂU: kiểm tra từng số bằng cách thử ước tới căn: qua subtask 1
// KY_VONG: 30
#include <bits/stdc++.h>
using namespace std;
bool isPrime(int x) {
    if (x < 2) return false;
    for (int d = 2; (long long)d * d <= x; d++)
        if (x % d == 0) return false;
    return true;
}
int main() {
    int q; cin >> q;
    while (q--) {
        int l, r; cin >> l >> r;
        int c = 0;
        for (int x = l; x <= r; x++) c += isPrime(x);
        cout << c << '\n';
    }
}
