// Máy in - Lời giải chuẩn: chặt nhị phân thời gian T, O(n log(1e18))
// [BƯỚC 1] Khai báo biến toàn cục
// > n, m và thời gian t của từng máy.
#include <bits/stdc++.h>
using namespace std;

int n;
long long m;
vector<long long> t;

// Trong T giây có in đủ m bản không?
// [BƯỚC 2] Hàm ok(T): T giây có in đủ m bản không?
// > Cộng T / tᵢ. Phải dừng ngay khi đã đủ m, vì cộng tiếp có thể vượt long long.
bool ok(long long T) {
    long long cnt = 0;
    for (long long x : t) {
        cnt += T / x;
        if (cnt >= m) return true;   // DỪNG SỚM: nếu cộng tiếp, cnt có thể vượt 9.2e18 và tràn
    }
    return false;
}

// [BƯỚC 3] Đọc dữ liệu
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cin >> n >> m;
    t.resize(n);
    for (auto &x : t) cin >> x;
    // [BƯỚC 4] Chặt nhị phân T nhỏ nhất
    // > hi = máy nhanh nhất × m là chắc chắn đủ. Nếu ok(mid) thì hi = mid, ngược lại lo = mid + 1.
    long long lo = 1;
    long long hi = *min_element(t.begin(), t.end()) * m;   // máy nhanh nhất in hết m bản: chắc chắn đủ (<= 1e18)
    while (lo < hi) {                // tìm T nhỏ nhất mà ok(T) = true
        long long mid = lo + (hi - lo) / 2;
        if (ok(mid)) hi = mid;       // đủ -> thử ít thời gian hơn
        else lo = mid + 1;           // chưa đủ -> cần nhiều thời gian hơn
    }
    // [BƯỚC 5] In kết quả
    cout << lo << '\n';
    return 0;
}
