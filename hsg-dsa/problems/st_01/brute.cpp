// Ký tự phổ biến nhất - Lời giải TRÂU O(|s|^2): với mỗi vị trí đếm lại cả xâu: qua subtask 1
// KY_VONG: 40
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s; cin >> s;
    int n = s.size();
    char bc = 'z' + 1; int bn = 0;
    for (int i = 0; i < n; i++) {
        int c = 0;
        for (int j = 0; j < n; j++) if (s[j] == s[i]) c++;
        if (c > bn || (c == bn && s[i] < bc)) { bn = c; bc = s[i]; }
    }
    cout << bc << ' ' << bn << '\n';
}
