// Lời giải QHĐ O(n^2) - ĐÚNG nhưng chậm: lấy được subtask 1, 2 (70 điểm)
// KY_VONG: 70
#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; cin >> n;
    vector<long long> a(n);
    for (auto &x : a) cin >> x;
    vector<int> f(n, 1);                     // f[i] = độ dài LIS kết thúc tại i
    int best = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++)
            if (a[j] < a[i]) f[i] = max(f[i], f[j] + 1);
        best = max(best, f[i]);
    }
    cout << best << '\n';
}
