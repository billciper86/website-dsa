// SAI cố ý: quên đánh dấu 1 không phải số nguyên tố
// KY_VONG: 0
#include <bits/stdc++.h>
using namespace std;
const int N = 10000000;
bool composite[N + 1];
int cnt[N + 1];
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    for (long long i = 2; i * i <= N; i++)
        if (!composite[i]) for (long long j = i * i; j <= N; j += i) composite[j] = true;
    for (int i = 1; i <= N; i++) cnt[i] = cnt[i - 1] + (composite[i] ? 0 : 1);
    int q; cin >> q;
    while (q--) { int l, r; cin >> l >> r; cout << cnt[r] - cnt[l - 1] << '\n'; }
}
