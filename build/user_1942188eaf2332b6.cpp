// SAI cố ý: mảng cộng dồn kiểu int -> tràn số khi |a| lớn
// KY_VONG: 30  (subtask 1 cũng có số tới 1e9 nên chỉ còn subtask 2)
#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, q; cin >> n >> q;
    vector<int> p(n + 1, 0);
    for (int i = 1; i <= n; i++) { int a; cin >> a; p[i] = p[i - 1] + a; }
    while (q--) { int l, r; cin >> l >> r; cout << p[r] - p[l - 1] << '\n'; }
}
