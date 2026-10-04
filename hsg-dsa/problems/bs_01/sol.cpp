// Đếm số trong khoảng - Lời giải chuẩn: sort + lower_bound/upper_bound, O((n + q) log n)
// [BƯỚC 1] Khung chương trình
// > Nạp thư viện, viết hàm main và bật đọc/ghi nhanh. Bước này bài nào cũng giống nhau.
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    // [BƯỚC 2] Đọc dãy và sắp xếp
    // > Tìm kiếm nhị phân chỉ dùng được trên dãy đã sắp xếp, nên sort một lần ngay sau khi đọc.
    int n, q;
    cin >> n >> q;
    vector<long long> a(n);
    for (auto &x : a) cin >> x;
    sort(a.begin(), a.end());                 // nhị phân CHỈ dùng được trên dãy đã sắp xếp
    // [BƯỚC 3] Đếm bằng lower_bound / upper_bound
    // > lower_bound(x) là vị trí đầu tiên ≥ x, upper_bound(y) là vị trí đầu tiên > y. Hiệu hai vị trí là số phần tử trong [x, y].
    while (q--) {
        long long x, y;
        cin >> x >> y;
        // lower_bound(x): vị trí đầu tiên có giá trị >= x
        // upper_bound(y): vị trí đầu tiên có giá trị >  y
        auto L = lower_bound(a.begin(), a.end(), x);
        auto R = upper_bound(a.begin(), a.end(), y);
        cout << (R - L) << '\n';               // số phần tử trong [x, y]
    }
    return 0;
}
