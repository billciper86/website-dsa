// Đoạn dài nhất có tổng <= S - Lời giải chuẩn: two pointers, O(n)
// [BƯỚC 1] Khung chương trình
// > Nạp thư viện, viết hàm main và bật đọc/ghi nhanh. Bước này bài nào cũng giống nhau.
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    // [BƯỚC 2] Đọc dữ liệu
    // > Đọc n, S (long long) và dãy a.
    int n;
    long long S;
    cin >> n >> S;
    vector<long long> a(n);
    for (auto &x : a) cin >> x;
    // [BƯỚC 3] Chuẩn bị cửa sổ
    // > sum là tổng đoạn [l, r] hiện tại, ban đầu l = 0.
    long long sum = 0;          // tổng đoạn [l, r] hiện tại (long long: tới 2e14)
    int l = 0, best = 0;
    // [BƯỚC 4] Đưa a[r] vào, co bên trái khi quá S
    // > Thêm a[r] vào sum. Khi sum > S thì bỏ a[l] và tăng l. Sau đó [l, r] hợp lệ, cập nhật best = max(best, r − l + 1).
    for (int r = 0; r < n; r++) {           // đầu phải tiến từng bước
        sum += a[r];                        // thêm a[r] vào cửa sổ
        while (sum > S) {                   // quá S -> bỏ bớt từ bên trái
            sum -= a[l];
            l++;
        }
        best = max(best, r - l + 1);        // [l, r] hợp lệ (có thể rỗng khi l = r + 1)
    }
    // [BƯỚC 5] In kết quả
    cout << best << '\n';
    return 0;
}
