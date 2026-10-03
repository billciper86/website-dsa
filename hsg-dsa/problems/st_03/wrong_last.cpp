// SAI cố ý: vòng lặp so sánh TRƯỚC khi trượt -> bỏ sót cửa sổ cuối cùng
// KY_VONG: 0
#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    string s, p; cin >> s >> p;
    int n = s.size(), m = p.size();
    if (m > n) { cout << 0 << '\n'; return 0; }
    array<int, 26> need{}, win{};
    for (char c : p) need[c - 'a']++;
    for (int i = 0; i < m; i++) win[s[i] - 'a']++;
    int cnt = 0;
    for (int i = m; i < n; i++) {
        if (win == need) cnt++;
        win[s[i] - 'a']++; win[s[i - m] - 'a']--;
    }
    cout << cnt << '\n';
}
