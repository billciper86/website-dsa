// Thuyền cứu hộ - Lời giải chuẩn: sort + tham lam hai con trỏ, O(n log n)
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    long long C;
    cin >> n >> C;
    vector<long long> w(n);
    for (auto &x : w) cin >> x;
    sort(w.begin(), w.end());
    int i = 0, j = n - 1, boats = 0;      // i: người nhẹ nhất còn lại, j: người nặng nhất còn lại
    while (i <= j) {
        if (i < j && w[i] + w[j] <= C) i++;   // người nhẹ nhất đi cùng người nặng nhất
        j--;                                  // người nặng nhất luôn đi chuyến này
        boats++;
    }
    cout << boats << '\n';
    return 0;
}
