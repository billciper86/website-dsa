// SAI cố ý: cho phép đoạn rỗng (best = 0, cur = max(0, ...)) -> sai khi mọi số âm
// KY_VONG: 0
#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; cin >> n;
    long long cur = 0, best = 0;
    for (int i = 0; i < n; i++) {
        long long x; cin >> x;
        cur = max(0LL, cur + x);
        best = max(best, cur);
    }
    cout << best << '\n';
}
