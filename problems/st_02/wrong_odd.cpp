// SAI cố ý: chỉ xét tâm là 1 ký tự -> bỏ sót xâu đối xứng độ dài chẵn
// KY_VONG: 0
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s; cin >> s;
    int n = s.size(), best = 1;
    for (int c = 0; c < n; c++) {
        int l = c, r = c;
        while (l >= 0 && r < n && s[l] == s[r]) { l--; r++; }
        best = max(best, r - l - 1);
    }
    cout << best << '\n';
}
