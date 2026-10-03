// ƯCLN và BCNN - Lời giải chuẩn: Euclid, O(log) mỗi cặp
#include <bits/stdc++.h>
using namespace std;

long long gcd_(long long a, long long b) {
    while (b != 0) {            // gcd(a, b) = gcd(b, a mod b)
        long long r = a % b;
        a = b;
        b = r;
    }
    return a;                   // gcd(a, 0) = a
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    cin >> T;
    while (T--) {
        long long a, b;
        cin >> a >> b;
        long long g = gcd_(a, b);           // C++17 có sẵn: __gcd(a, b) hoặc gcd(a, b)
        long long l = a / g * b;            // CHIA TRƯỚC rồi nhân: a/g*b <= 1e18, không tràn
        cout << g << ' ' << l << '\n';
    }
    return 0;
}
