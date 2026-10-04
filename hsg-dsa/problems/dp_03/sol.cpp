// Ếch nhảy - Lời giải chuẩn: QHĐ 1 chiều, O(n*K)
// [BƯỚC 1] Khung chương trình
// > Nạp thư viện, viết hàm main và bật đọc/ghi nhanh. Bước này bài nào cũng giống nhau.
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    // [BƯỚC 2] Đọc dữ liệu
    int n, K;
    cin >> n >> K;
    vector<long long> h(n + 1);
    for (int i = 1; i <= n; i++) cin >> h[i];
    // [BƯỚC 3] Khởi tạo f
    // > f[i] = sức lực ít nhất tới hòn i. f[1] = 0, còn lại bằng vô cùng.
    vector<long long> f(n + 1, LLONG_MAX);   // f[i] = sức lực nhỏ nhất để tới hòn i
    f[1] = 0;                                // đứng sẵn ở hòn 1: không tốn gì
    // [BƯỚC 4] Công thức truy hồi
    // > f[i] = min(f[j] + |h[j] − h[i]|) với j từ max(1, i − K) tới i − 1.
    for (int i = 2; i <= n; i++)
        for (int j = max(1, i - K); j < i; j++)          // nhảy từ hòn j (cách i không quá K) tới i
            f[i] = min(f[i], f[j] + llabs(h[j] - h[i]));
    // [BƯỚC 5] In kết quả
    cout << f[n] << '\n';
    return 0;
}
