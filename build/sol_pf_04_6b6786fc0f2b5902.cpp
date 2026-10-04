// Tổng hình chữ nhật - Lời giải chuẩn: prefix sum 2D, O(n*m + q)
// [BƯỚC 1] Khung chương trình
// > Nạp thư viện, viết hàm main và bật đọc/ghi nhanh. Bước này bài nào cũng giống nhau.
#include <bits/stdc++.h>
using namespace std;

long long S[505][505];   // mảng toàn cục: tự khởi tạo bằng 0, không lo tràn stack

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    // [BƯỚC 2] Dựng bảng S 2 chiều
    // > S[i][j] = a + S[i − 1][j] + S[i][j − 1] − S[i − 1][j − 1]: phần chồng nhau bị cộng 2 lần nên trừ đi 1 lần. Khai báo S toàn cục.
    int n, m, q;
    cin >> n >> m >> q;
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++) {
            long long a;
            cin >> a;
            // S[i][j] = ô (i,j) + phần trên + phần trái - phần chồng nhau (bị cộng 2 lần)
            S[i][j] = a + S[i - 1][j] + S[i][j - 1] - S[i - 1][j - 1];
        }
    // [BƯỚC 3] Trả lời truy vấn bằng 4 ô
    // > Lấy hình lớn, trừ dải trên và dải trái, cộng lại góc bị trừ 2 lần.
    while (q--) {
        int x1, y1, x2, y2;
        cin >> x1 >> y1 >> x2 >> y2;
        // Lấy hình lớn, bỏ dải phía trên và dải bên trái, cộng lại góc bị trừ 2 lần
        long long ans = S[x2][y2] - S[x1 - 1][y2] - S[x2][y1 - 1] + S[x1 - 1][y1 - 1];
        cout << ans << '\n';
    }
    return 0;
}
