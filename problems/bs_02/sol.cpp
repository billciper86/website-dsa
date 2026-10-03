// Cắt gỗ - Lời giải chuẩn: chặt nhị phân theo kết quả, O(n log(max a))
#include <bits/stdc++.h>
using namespace std;

int n;
long long k;
vector<long long> a;

// Với độ dài L, cắt được ít nhất k thanh không?
bool ok(long long L) {
    long long cnt = 0;                  // long long: tổng có thể ~2e14
    for (long long x : a) {
        cnt += x / L;
        if (cnt >= k) return true;      // đủ rồi thì dừng sớm
    }
    return false;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cin >> n >> k;
    a.resize(n);
    for (auto &x : a) cin >> x;
    // ok(L) có dạng: true true ... true false false ... -> tìm L cuối cùng còn true
    long long lo = 1, hi = *max_element(a.begin(), a.end()), ans = 0;
    while (lo <= hi) {
        long long mid = lo + (hi - lo) / 2;  // viết thế này để không tràn số
        if (ok(mid)) { ans = mid; lo = mid + 1; }   // được -> thử L lớn hơn
        else hi = mid - 1;                          // không được -> giảm L
    }
    cout << ans << '\n';
    return 0;
}
