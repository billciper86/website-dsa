// Đếm bội số - Lời giải chuẩn O(1) mỗi truy vấn
// [BƯỚC 1] Khung chương trình
// > Nạp thư viện, viết hàm main và bật đọc/ghi nhanh. Bước này bài nào cũng giống nhau.
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);   // đọc/ghi nhanh: bắt buộc khi T lớn
    cin.tie(nullptr);
    // [BƯỚC 2] Đọc số câu hỏi
    // > Đọc T rồi lặp T lần, mỗi lần xử lý một câu hỏi.
    int T;
    cin >> T;
    while (T--) {
        // [BƯỚC 3] Đọc a, b, k bằng long long
        // > b và k tới 10¹⁸ nên phải khai báo long long, int chỉ chứa tới khoảng 2·10⁹.
        long long a, b, k;          // b tới 1e18 -> PHẢI dùng long long (int chỉ tới ~2.1e9)
        cin >> a >> b >> k;
        // Số bội của k trong [1, x] là x / k (chia nguyên).
        // Số bội trong [a, b] = (số bội trong [1, b]) - (số bội trong [1, a-1]).
        // [BƯỚC 4] Dùng công thức thay vì duyệt
        // > Trong [1, x] có x / k bội của k. Lấy (bội trong [1, b]) trừ (bội trong [1, a − 1]). Nhớ là a − 1 chứ không phải a.
        cout << b / k - (a - 1) / k << '\n';   // dùng '\n' thay endl cho nhanh
    }
    return 0;
}
