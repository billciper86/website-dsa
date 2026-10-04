// Tưới cây - Lời giải chuẩn: mảng hiệu (difference array), O(n + m)
// [BƯỚC 1] Khung chương trình
// > Nạp thư viện, viết hàm main và bật đọc/ghi nhanh. Bước này bài nào cũng giống nhau.
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    // [BƯỚC 2] Đọc dữ liệu và tạo mảng hiệu
    // > Tạo d có n + 2 ô (vì sẽ ghi vào d[r + 1] với r = n).
    int n, m;
    cin >> n >> m;
    vector<long long> a(n + 1), d(n + 2, 0);   // d cần tới chỉ số n+1 (vì d[r+1] với r = n)
    for (int i = 1; i <= n; i++) cin >> a[i];
    // [BƯỚC 3] Mỗi lần tưới chỉ sửa 2 ô
    // > d[l] += x để từ l trở đi được cộng x; d[r + 1] −= x để từ r + 1 trở đi trừ lại.
    while (m--) {
        int l, r;
        long long x;
        cin >> l >> r >> x;
        d[l] += x;          // từ l trở đi được cộng x
        d[r + 1] -= x;      // từ r+1 trở đi trừ lại x -> chỉ đoạn [l, r] được cộng
    }
    // [BƯỚC 4] Cộng dồn mảng hiệu
    // > add = d[1] + … + d[i] là lượng được cộng vào cây i. In a[i] + add.
    long long add = 0;      // add = d[1] + ... + d[i] = tổng lượng được cộng vào cây i
    for (int i = 1; i <= n; i++) {
        add += d[i];
        cout << a[i] + add << (i == n ? '\n' : ' ');   // long long: tới ~2e14
    }
    return 0;
}
