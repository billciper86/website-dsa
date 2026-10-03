// SAI cố ý: dùng ">=" -> khi bằng nhau lại chọn ký tự LỚN hơn
// KY_VONG: 0
#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    string s; cin >> s;
    int cnt[26] = {0};
    for (char c : s) cnt[c - 'a']++;
    int best = 0;
    for (int k = 1; k < 26; k++) if (cnt[k] >= cnt[best]) best = k;
    cout << char('a' + best) << ' ' << cnt[best] << '\n';
}
