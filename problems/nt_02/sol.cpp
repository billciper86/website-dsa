// Đếm số nguyên tố - Lời giải chuẩn: sàng Eratosthenes + prefix sum
#include <bits/stdc++.h>
using namespace std;

const int N = 10000000;
bool composite[N + 1];      // mảng toàn cục ~10MB: composite[i] = true nếu i KHÔNG nguyên tố
int cnt[N + 1];             // cnt[i] = số số nguyên tố <= i (~40MB, vẫn < 256MB)

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    composite[0] = composite[1] = true;          // 0 và 1 không phải số nguyên tố
    for (long long i = 2; i * i <= N; i++)       // chỉ cần sàng tới căn N
        if (!composite[i])
            for (long long j = i * i; j <= N; j += i)  // bắt đầu từ i*i: các bội nhỏ hơn đã bị gạch
                composite[j] = true;
    for (int i = 1; i <= N; i++)
        cnt[i] = cnt[i - 1] + (composite[i] ? 0 : 1);
    int q;
    cin >> q;
    while (q--) {
        int l, r;
        cin >> l >> r;
        cout << cnt[r] - cnt[l - 1] << '\n';
    }
    return 0;
}
