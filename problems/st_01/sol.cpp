// Ký tự phổ biến nhất - Lời giải chuẩn: mảng đếm tần suất, O(|s| + 26)
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string s;
    cin >> s;
    int cnt[26] = {0};                  // cnt[k] = số lần ký tự 'a'+k xuất hiện
    for (char c : s) cnt[c - 'a']++;    // 'a' -> 0, 'b' -> 1, ...
    int best = 0;
    for (int k = 1; k < 26; k++)
        if (cnt[k] > cnt[best]) best = k;   // ">" (không phải ">="): bằng nhau thì giữ ký tự nhỏ hơn
    cout << char('a' + best) << ' ' << cnt[best] << '\n';
    return 0;
}
