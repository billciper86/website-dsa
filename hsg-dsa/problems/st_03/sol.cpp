// Đếm hoán vị - Lời giải chuẩn: cửa sổ trượt + bảng đếm 26 chữ cái, O(26 * |s|)
// [BƯỚC 1] Khung chương trình
// > Nạp thư viện, viết hàm main và bật đọc/ghi nhanh. Bước này bài nào cũng giống nhau.
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    // [BƯỚC 2] Đọc và xử lý |p| > |s|
    string s, p;
    cin >> s >> p;
    int n = s.size(), m = p.size();
    if (m > n) { cout << 0 << '\n'; return 0; }     // không có cửa sổ nào
    // [BƯỚC 3] Đếm p và cửa sổ đầu tiên
    // > need = tần suất của p; win = tần suất của s[0..m − 1].
    array<int, 26> need{}, win{};                    // tần suất của p và của cửa sổ hiện tại
    for (char c : p) need[c - 'a']++;
    for (int i = 0; i < m; i++) win[s[i] - 'a']++;   // cửa sổ đầu tiên s[0..m-1]
    int cnt = (win == need);                         // so sánh 2 mảng 26 phần tử
    // [BƯỚC 4] Trượt cửa sổ
    // > s[i] vào, s[i − m] ra; nếu win == need thì đếm.
    for (int i = m; i < n; i++) {                    // trượt: s[i] vào, s[i-m] ra
        win[s[i] - 'a']++;
        win[s[i - m] - 'a']--;
        if (win == need) cnt++;
    }
    // [BƯỚC 5] In kết quả
    cout << cnt << '\n';
    return 0;
}
