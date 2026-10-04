// Xếp hàng - Lời giải chuẩn: tham lam, người nhanh làm trước, O(n log n)
// [BƯỚC 1] Khung chương trình
// > Nạp thư viện, viết hàm main và bật đọc/ghi nhanh. Bước này bài nào cũng giống nhau.
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    // [BƯỚC 2] Đọc và sắp tăng dần
    // > Người làm nhanh đứng trước.
    int n;
    cin >> n;
    vector<long long> t(n);
    for (auto &x : t) cin >> x;
    sort(t.begin(), t.end());            // thời gian tăng dần
    // [BƯỚC 3] Cộng thời điểm xong của từng người
    // > now là thời điểm người hiện tại xong; total cộng dồn now. Dùng long long.
    long long now = 0, total = 0;        // long long: tổng tới ~2e16
    for (long long x : t) {
        now += x;                        // thời điểm người này làm xong
        total += now;
    }
    // [BƯỚC 4] In kết quả
    cout << total << '\n';
    return 0;
}
