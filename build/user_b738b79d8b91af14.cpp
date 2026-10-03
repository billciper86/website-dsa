// Xâu con chung dài nhất (LCS) - Lời giải chuẩn: QHĐ 2 chiều, O(|s|*|t|), chỉ giữ 2 hàng
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string s, t;
    cin >> s >> t;
    int n = s.size(), m = t.size();
    // prev = hàng i-1, cur = hàng i của bảng f (tiết kiệm bộ nhớ: chỉ 2 hàng)
    vector<int> prev(m + 1, 0), cur(m + 1, 0);
    for (int i = 1; i <= n; i++) {
        cur[0] = 0;
        for (int j = 1; j <= m; j++) {
            if (s[i - 1] == t[j - 1]) cur[j] = prev[j - 1] + 1;   // ký tự trùng: ghép vào đáp án
            else cur[j] = max(prev[j], cur[j - 1]);               // bỏ ký tự cuối của s hoặc của t
        }
        swap(prev, cur);
    }
    cout << prev[m] << '\n';
    return 0;
}
