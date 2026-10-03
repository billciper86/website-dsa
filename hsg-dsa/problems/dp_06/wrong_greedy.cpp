// SAI cố ý: tham lam - với mỗi ký tự của s, ghép ngay với ký tự giống nó gần nhất trong t
// KY_VONG: 0
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s, t; cin >> s >> t;
    int j = 0, cnt = 0;
    for (char c : s) {
        int k = j;
        while (k < (int)t.size() && t[k] != c) k++;
        if (k < (int)t.size()) { cnt++; j = k + 1; }
    }
    cout << cnt << '\n';
}
