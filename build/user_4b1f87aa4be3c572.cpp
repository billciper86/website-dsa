// Xâu đối xứng dài nhất - Lời giải chuẩn: mở rộng từ tâm, O(n^2)
#include <bits/stdc++.h>
using namespace std;

string s;
int n;

// Loang từ tâm (l, r) sang hai bên khi s[l] == s[r]; trả về độ dài xâu đối xứng lớn nhất
int expand(int l, int r) {
    while (l >= 0 && r < n && s[l] == s[r]) { l--; r++; }
    return r - l - 1;          // sau vòng while, (l, r) đã vượt quá 1 bước mỗi bên
}

int main() {
    cin >> s;
    n = s.size();
    int best = 1;
    for (int c = 0; c < n; c++) {
        best = max(best, expand(c, c));       // tâm là 1 ký tự  -> độ dài lẻ
        best = max(best, expand(c, c + 1));   // tâm giữa c, c+1 -> độ dài chẵn (hay bị quên!)
    }
    cout << best << '\n';
    return 0;
}
