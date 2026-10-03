// Máy in - Lời giải chuẩn: chặt nhị phân thời gian T, O(n log(1e18))
#include <bits/stdc++.h>
using namespace std;

int n;
long long m;
vector<long long> t;

// Trong T giây có in đủ m bản không?
bool ok(long long T) {
    long long cnt = 0;
    for (long long x : t) {
        cnt += T / x;
        if (cnt >= m) return true;   // DỪNG SỚM: nếu cộng tiếp, cnt có thể vượt 9.2e18 và tràn
    }
    return false;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cin >> n >> m;
    t.resize(n);
    for (auto &x : t) cin >> x;
    long long lo = 1;
    long long hi = *min_element(t.begin(), t.end()) * m;   // máy nhanh nhất in hết m bản: chắc chắn đủ (<= 1e18)
    while (lo < hi) {                // tìm T nhỏ nhất mà ok(T) = true
        long long mid = lo + (hi - lo) / 2;
        if (ok(mid)) hi = mid;       // đủ -> thử ít thời gian hơn
        else lo = mid + 1;           // chưa đủ -> cần nhiều thời gian hơn
    }
    cout << lo << '\n';
    return 0;
}
