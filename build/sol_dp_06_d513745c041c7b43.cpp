// Xâu con chung dài nhất (LCS) - Lời giải chuẩn: QHĐ 2 chiều, O(|s|*|t|), chỉ giữ 2 hàng
// [BƯỚC 1] Khung chương trình
// > Nạp thư viện, viết hàm main và bật đọc/ghi nhanh. Bước này bài nào cũng giống nhau.
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    // [BƯỚC 2] Đọc 2 xâu, 2 hàng của bảng
    // > Chỉ cần giữ hàng trước (prev) và hàng hiện tại (cur).
    string s, t;
    cin >> s >> t;
    int n = s.size(), m = t.size();
    // prev = hàng i-1, cur = hàng i của bảng f (tiết kiệm bộ nhớ: chỉ 2 hàng)
    vector<int> prev(m + 1, 0), cur(m + 1, 0);
    // [BƯỚC 3] Điền bảng
    // > Nếu s[i − 1] == t[j − 1] thì cur[j] = prev[j − 1] + 1, ngược lại cur[j] = max(prev[j], cur[j − 1]). Hết hàng thì swap.
    for (int i = 1; i <= n; i++) {
        cur[0] = 0;
        for (int j = 1; j <= m; j++) {
            if (s[i - 1] == t[j - 1]) cur[j] = prev[j - 1] + 1;   // ký tự trùng: ghép vào đáp án
            else cur[j] = max(prev[j], cur[j - 1]);               // bỏ ký tự cuối của s hoặc của t
        }
        swap(prev, cur);
    }
    // [BƯỚC 4] In kết quả
    cout << prev[m] << '\n';
    return 0;
}
