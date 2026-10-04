// Ký tự phổ biến nhất - Lời giải chuẩn: mảng đếm tần suất, O(|s| + 26)
// [BƯỚC 1] Khung chương trình
// > Nạp thư viện, viết hàm main và bật đọc/ghi nhanh. Bước này bài nào cũng giống nhau.
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    // [BƯỚC 2] Đếm 26 chữ cái
    // > cnt[c − 'a']++ cho mỗi ký tự.
    string s;
    cin >> s;
    int cnt[26] = {0};                  // cnt[k] = số lần ký tự 'a'+k xuất hiện
    for (char c : s) cnt[c - 'a']++;    // 'a' -> 0, 'b' -> 1, ...
    // [BƯỚC 3] Tìm chữ xuất hiện nhiều nhất
    // > Chỉ đổi khi số lần lớn hơn hẳn (dùng >), để khi bằng nhau thì giữ chữ nhỏ hơn.
    int best = 0;
    for (int k = 1; k < 26; k++)
        if (cnt[k] > cnt[best]) best = k;   // ">" (không phải ">="): bằng nhau thì giữ ký tự nhỏ hơn
    // [BƯỚC 4] In kết quả
    cout << char('a' + best) << ' ' << cnt[best] << '\n';
    return 0;
}
