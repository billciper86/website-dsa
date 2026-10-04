// Đếm ước - Lời giải chuẩn O(sqrt(n)) mỗi số
// [BƯỚC 1] Khung chương trình
// > Nạp thư viện và viết hàm main.
#include <bits/stdc++.h>
using namespace std;

int main() {
    // [BƯỚC 2] Đọc số lượng
    // > Đọc T rồi lặp T lần.
    int T;
    cin >> T;
    while (T--) {
        long long n;
        cin >> n;
        // [BƯỚC 3] Chuẩn bị bộ đếm
        // > Đọc n (long long) và khởi tạo cnt = 0.
        long long cnt = 0;
        // d chạy tới sqrt(n). Viết d * d <= n (KHÔNG dùng sqrt() vì sai số số thực).
        // d phải là long long: d*d tới 1e12 sẽ tràn nếu d là int.
        // [BƯỚC 4] Duyệt d tới căn n
        // > Cho d chạy khi d·d ≤ n, không dùng sqrt. Gặp ước d thì có thêm ước n/d; nếu d = n/d (số chính phương) thì chỉ đếm 1 lần.
        for (long long d = 1; d * d <= n; d++) {
            if (n % d == 0) {
                cnt++;                    // ước d
                if (d != n / d) cnt++;    // ước n/d (khác d thì mới đếm thêm)
            }
        }
        // [BƯỚC 5] In kết quả
        // > In số ước của n.
        cout << cnt << '\n';
    }
    return 0;
}
