// Cắt gỗ - Lời giải chuẩn: chặt nhị phân theo kết quả, O(n log(max a))
// [BƯỚC 1] Khai báo biến toàn cục
// > Để hàm ok() dùng chung n, k và dãy a.
#include <bits/stdc++.h>
using namespace std;

int n;
long long k;
vector<long long> a;

// Với độ dài L, cắt được ít nhất k thanh không?
// [BƯỚC 2] Viết hàm kiểm tra ok(L)
// > Đếm tổng a/L. Đủ k thì trả về true ngay (dừng sớm, tránh tràn số). Dùng long long.
bool ok(long long L) {
    long long cnt = 0;                  // long long: tổng có thể ~2e14
    for (long long x : a) {
        cnt += x / L;
        if (cnt >= k) return true;      // đủ rồi thì dừng sớm
    }
    return false;
}

// [BƯỚC 3] Đọc dữ liệu
// > Đọc n, k và dãy a.
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cin >> n >> k;
    a.resize(n);
    for (auto &x : a) cin >> x;
    // ok(L) có dạng: true true ... true false false ... -> tìm L cuối cùng còn true
    // [BƯỚC 4] Chặt nhị phân L lớn nhất
    // > ok(L) có dạng true…true false…false. Nếu ok(mid) thì ghi nhận mid và thử lớn hơn; ngược lại giảm hi. Khởi tạo ans = 0 cho trường hợp không có đáp án.
    long long lo = 1, hi = *max_element(a.begin(), a.end()), ans = 0;
    while (lo <= hi) {
        long long mid = lo + (hi - lo) / 2;  // viết thế này để không tràn số
        if (ok(mid)) { ans = mid; lo = mid + 1; }   // được -> thử L lớn hơn
        else hi = mid - 1;                          // không được -> giảm L
    }
    // [BƯỚC 5] In kết quả
    cout << ans << '\n';
    return 0;
}
