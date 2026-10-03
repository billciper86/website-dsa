// Đếm hoán vị - Lời giải TRÂU: sort từng xâu con rồi so sánh, O(|s| * |p| log |p|): qua subtask 1
// KY_VONG: 40
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s, p; cin >> s >> p;
    int n = s.size(), m = p.size(), cnt = 0;
    sort(p.begin(), p.end());
    for (int i = 0; i + m <= n; i++) {
        string sub = s.substr(i, m);
        sort(sub.begin(), sub.end());
        if (sub == p) cnt++;
    }
    cout << cnt << '\n';
}
