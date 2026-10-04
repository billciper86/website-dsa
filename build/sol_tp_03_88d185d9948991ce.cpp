// Đoạn ít màu - Lời giải chuẩn: cửa sổ trượt + map đếm, O(n log n)
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
    vector<int> a(n);
    for (auto &x : a) cin >> x;
    // [BƯỚC 3] Map đếm màu trong cửa sổ
    // > cnt[màu] = số bóng màu đó trong [l, r]; cnt.size() = số màu khác nhau.
    map<int, int> cnt;          // cnt[màu] = số bóng màu đó trong cửa sổ [l, r]
    int l = 0, best = 0;
    // [BƯỚC 4] Thêm bóng r, co khi quá K màu
    // > Khi cnt.size() > K thì giảm cnt[a[l]]; về 0 thì phải erase khỏi map, rồi l++.
    for (int r = 0; r < n; r++) {
        cnt[a[r]]++;                            // thêm bóng r
        while ((int)cnt.size() > K) {           // quá K màu -> bỏ bớt bên trái
            if (--cnt[a[l]] == 0) cnt.erase(a[l]);   // màu hết hẳn thì XÓA khỏi map
            l++;
        }
        best = max(best, r - l + 1);
    }
    // [BƯỚC 5] In kết quả
    cout << best << '\n';
    return 0;
}
