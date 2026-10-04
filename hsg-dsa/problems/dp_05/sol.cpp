// Dãy con tăng dài nhất (LIS) - Lời giải chuẩn O(n log n) dùng lower_bound
// [BƯỚC 1] Khung chương trình
// > Nạp thư viện, viết hàm main và bật đọc/ghi nhanh. Bước này bài nào cũng giống nhau.
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    // [BƯỚC 2] Đọc n
    int n;
    cin >> n;
    // tail[k] = phần tử CUỐI nhỏ nhất có thể của một dãy con tăng độ dài k+1
    // tail luôn tăng dần -> tìm kiếm nhị phân được
    // [BƯỚC 3] Mảng tail
    // > tail[k] = phần tử cuối nhỏ nhất của dãy tăng dài k + 1. Mảng này luôn tăng dần.
    vector<long long> tail;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        // vị trí đầu tiên có tail[k] >= x (lower_bound vì tăng NGẶT: x không được nối sau số bằng nó)
        // [BƯỚC 4] Cập nhật tail cho mỗi x
        // > Tìm lower_bound(x). Nếu ở cuối mảng thì push_back(x), ngược lại thay *it = x.
        auto it = lower_bound(tail.begin(), tail.end(), x);
        if (it == tail.end()) tail.push_back(x);   // x lớn hơn mọi phần tử cuối -> kéo dài dãy dài nhất
        else *it = x;                              // thay bằng x nhỏ hơn: dễ nối thêm về sau
    }
    // [BƯỚC 5] In kết quả
    // > Độ dài LIS = tail.size().
    cout << tail.size() << '\n';
    return 0;
}
