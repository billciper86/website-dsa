// SAI cố ý: dùng upper_bound -> tính dãy KHÔNG GIẢM thay vì tăng ngặt
// KY_VONG: 0
#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; cin >> n;
    vector<long long> tail;
    for (int i = 0; i < n; i++) {
        long long x; cin >> x;
        auto it = upper_bound(tail.begin(), tail.end(), x);
        if (it == tail.end()) tail.push_back(x); else *it = x;
    }
    cout << tail.size() << '\n';
}
