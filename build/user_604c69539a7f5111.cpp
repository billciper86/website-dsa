#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, q;
    cin >> n >> q;
    vector<long long> p(n + 1, 0);
    for (int i = 1; i <= n; i++) {
        long long a;
        cin >> a;
        p[i] = p[i - 1] + a;
    }
    while (q--) {
        int l, r;
        cin >> l >> r;
        cout << p[r] - p[l] << '\n';
    }
    return 0;
}