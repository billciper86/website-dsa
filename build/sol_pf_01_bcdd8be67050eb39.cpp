// Tổng đoạn - Lời giải chuẩn: mảng cộng dồn, O(n + q)
// [BƯỚC 1] Khung chương trình
// > Nạp thư viện, viết hàm main và bật đọc/ghi nhanh. Bước này bài nào cũng giống nhau.
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    // [BƯỚC 2] Đọc n, q
    // > Đọc kích thước dãy và số câu hỏi.
    int n, q;
    cin >> n >> q;
    // [BƯỚC 3] Dựng mảng cộng dồn
    // > p[0] = 0, p[i] = p[i − 1] + a[i]. Dùng long long vì tổng có thể tới 2·10¹⁴, và đánh chỉ số từ 1 cho khớp công thức.
    vector<long long> p(n + 1, 0);       // p[0] = 0, chỉ số từ 1 cho dễ
    for (int i = 1; i <= n; i++) {
        long long a;
        cin >> a;
        p[i] = p[i - 1] + a;             // p[i] = a1 + ... + ai (long long: tới 2e14)
    }
    // [BƯỚC 4] Trả lời từng câu hỏi bằng 1 phép trừ
    // > Tổng [l, r] = p[r] − p[l − 1]. Hãy thử với l = r để chắc không bị lệch chỉ số.
    while (q--) {
        int l, r;
        cin >> l >> r;
        cout << p[r] - p[l - 1] << '\n'; // tổng [l, r] = p[r] - p[l-1]  (chú ý l-1!)
    }
    return 0;
}
