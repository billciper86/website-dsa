// Cái túi 0/1 - Lời giải chuẩn: QHĐ mảng 1 chiều, O(n*W)
// [BƯỚC 1] Khung chương trình
// > Nạp thư viện, viết hàm main và bật đọc/ghi nhanh. Bước này bài nào cũng giống nhau.
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    // [BƯỚC 2] Mảng dp theo khối lượng
    // > dp[j] = giá trị lớn nhất với tổng khối lượng ≤ j, ban đầu toàn 0.
    int n, W;
    cin >> n >> W;
    vector<long long> dp(W + 1, 0);      // dp[j] = giá trị lớn nhất với tổng khối lượng <= j
    // [BƯỚC 3] Thêm từng món, j giảm dần
    // > Với món (w, v): for j = W xuống w: dp[j] = max(dp[j], dp[j − w] + v). Giảm dần để mỗi món chỉ được lấy 1 lần.
    for (int i = 0; i < n; i++) {
        int w;
        long long v;
        cin >> w >> v;
        // j GIẢM DẦN: dp[j - w] lúc này vẫn là giá trị "chưa có món i" -> mỗi món chỉ lấy 1 lần
        for (int j = W; j >= w; j--)
            dp[j] = max(dp[j], dp[j - w] + v);   // không lấy món i / lấy món i
    }
    // [BƯỚC 4] In kết quả
    cout << dp[W] << '\n';
    return 0;
}
