// Thuyền cứu hộ - Lời giải chuẩn: sort + tham lam hai con trỏ, O(n log n)
// [BƯỚC 1] Khung chương trình
// > Nạp thư viện, viết hàm main và bật đọc/ghi nhanh. Bước này bài nào cũng giống nhau.
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    // [BƯỚC 2] Đọc và sắp xếp cân nặng
    int n;
    long long C;
    cin >> n >> C;
    vector<long long> w(n);
    for (auto &x : w) cin >> x;
    sort(w.begin(), w.end());
    // [BƯỚC 3] Hai con trỏ: nhẹ nhất i, nặng nhất j
    // > Người j luôn đi chuyến này. Nếu w[i] + w[j] ≤ C thì i đi cùng (i++). Sau đó j−−, boats++.
    int i = 0, j = n - 1, boats = 0;      // i: người nhẹ nhất còn lại, j: người nặng nhất còn lại
    while (i <= j) {
        if (i < j && w[i] + w[j] <= C) i++;   // người nhẹ nhất đi cùng người nặng nhất
        j--;                                  // người nặng nhất luôn đi chuyến này
        boats++;
    }
    // [BƯỚC 4] In kết quả
    cout << boats << '\n';
    return 0;
}
