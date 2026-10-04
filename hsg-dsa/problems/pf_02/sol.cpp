// Đếm đoạn có tổng K - Lời giải chuẩn: prefix sum + map, O(n log n)
// [BƯỚC 1] Khung chương trình
// > Nạp thư viện, viết hàm main và bật đọc/ghi nhanh. Bước này bài nào cũng giống nhau.
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    // [BƯỚC 2] Đọc dữ liệu
    // > Đọc n và K (long long).
    int n;
    long long K;
    cin >> n >> K;
    // [BƯỚC 3] Chuẩn bị map đếm tổng tiền tố
    // > cnt[x] = số lần tổng tiền tố bằng x đã xuất hiện. Đặt cnt[0] = 1 vì p[0] = 0 cũng là một tiền tố.
    map<long long, long long> cnt;  // cnt[x] = số lần tổng tiền tố x đã xuất hiện
    cnt[0] = 1;                     // p[0] = 0 (đoạn bắt đầu từ vị trí 1) - HAY QUÊN!
    long long p = 0, ans = 0;       // ans có thể ~2e10 -> long long
    // [BƯỚC 4] Duyệt r và tra map
    // > Cộng a vào p. Đoạn [l, i] có tổng K khi p[l − 1] = p − K, nên cộng cnt[p − K] vào đáp án, sau đó mới tăng cnt[p].
    for (int i = 1; i <= n; i++) {
        long long a;
        cin >> a;
        p += a;                     // p = p[i]
        // Đoạn [l, i] có tổng K  <=>  p[l-1] = p[i] - K
        auto it = cnt.find(p - K);
        if (it != cnt.end()) ans += it->second;
        cnt[p]++;                   // thêm p[i] vào sau khi đếm (để l-1 < i)
    }
    // [BƯỚC 5] In kết quả
    // > ans có thể tới 2·10¹⁰ nên dùng long long.
    cout << ans << '\n';
    return 0;
}
