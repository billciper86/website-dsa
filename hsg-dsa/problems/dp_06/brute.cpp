// LCS - Lời giải TRÂU: thử mọi xâu con của s, kiểm tra có là xâu con của t: qua subtask 1
// KY_VONG: 30
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s, t; cin >> s >> t;
    int n = s.size(), best = 0;
    if (n > 30) n = 30;   // tránh dịch bit quá 31; với xâu dài cách này vốn đã quá chậm
    for (long long mask = 0; mask < (1LL << n); mask++) {
        int len = __builtin_popcountll(mask);
        if (len <= best) continue;
        int j = 0; bool ok = true;
        for (int i = 0; i < n && ok; i++)
            if (mask >> i & 1) {
                while (j < (int)t.size() && t[j] != s[i]) j++;
                if (j == (int)t.size()) ok = false; else j++;
            }
        if (ok) best = len;
    }
    cout << best << '\n';
}
