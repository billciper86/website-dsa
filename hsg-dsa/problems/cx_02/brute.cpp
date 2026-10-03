// Cặp chia hết - Lời giải TRÂU O(n^2): qua subtask 1
// KY_VONG: 40
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, k;
    cin >> n >> k;
    vector<long long> a(n);
    for (auto &x : a) cin >> x;
    long long ans = 0;
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            if ((a[i] + a[j]) % k == 0) ans++;   // a là long long nên tổng không tràn
    cout << ans << '\n';
}
