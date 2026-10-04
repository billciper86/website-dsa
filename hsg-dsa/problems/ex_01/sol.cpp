// Đoạn chia hết - prefix sum theo số dư + map, O(n log n)
// [BƯỚC 1] Khung chương trình
// > Nạp thư viện, viết hàm main và bật đọc/ghi nhanh. Bước này bài nào cũng giống nhau.
#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    // [BƯỚC 2] Map đếm số dư tiền tố
    // > cnt[0] = 1 (p[0] = 0).
    int n; long long k; cin >> n >> k;
    map<long long, long long> cnt;
    cnt[0] = 1;                                 // p[0] = 0
    long long p = 0, ans = 0;
    // [BƯỚC 3] Duyệt và đếm
    // > p = ((p + a) % k + k) % k để số dư không âm. Cộng cnt[p] vào đáp án rồi cnt[p]++.
    for (int i = 0; i < n; i++) {
        long long a; cin >> a;
        p = ((p + a) % k + k) % k;              // số dư luôn trong [0, k-1] kể cả khi a âm
        ans += cnt[p];                          // các p[l-1] cùng số dư với p[r]
        cnt[p]++;
    }
    // [BƯỚC 4] In kết quả
    cout << ans << '\n';
}
