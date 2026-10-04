// Kho báu trên lưới - QHĐ: f[i][j] = a[i][j] + max(f[i-1][j], f[i][j-1]), O(n*m)
// [BƯỚC 1] Bảng f toàn cục
#include <bits/stdc++.h>
using namespace std;
long long f[505][505];
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m; cin >> n >> m;
    // [BƯỚC 2] Viền là −∞
    // > Ô ngoài lưới không được chọn, nên gán giá trị rất nhỏ.
    const long long NEG = LLONG_MIN / 4;               // "âm vô cùng" an toàn khi cộng thêm
    for (int i = 0; i <= n; i++) for (int j = 0; j <= m; j++) f[i][j] = NEG;   // viền ngoài: không đi được
    // [BƯỚC 3] Điền bảng
    // > f[1][1] = a; còn lại f = a + max(trên, trái).
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++) {
            long long a; cin >> a;
            if (i == 1 && j == 1) f[i][j] = a;
            else f[i][j] = a + max(f[i - 1][j], f[i][j - 1]);
        }
    // [BƯỚC 4] In kết quả
    cout << f[n][m] << '\n';
}
