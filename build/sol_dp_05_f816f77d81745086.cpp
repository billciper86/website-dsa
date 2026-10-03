// Dãy con tăng dài nhất (LIS) - Lời giải chuẩn O(n log n) dùng lower_bound
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    // tail[k] = phần tử CUỐI nhỏ nhất có thể của một dãy con tăng độ dài k+1
    // tail luôn tăng dần -> tìm kiếm nhị phân được
    vector<long long> tail;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        // vị trí đầu tiên có tail[k] >= x (lower_bound vì tăng NGẶT: x không được nối sau số bằng nó)
        auto it = lower_bound(tail.begin(), tail.end(), x);
        if (it == tail.end()) tail.push_back(x);   // x lớn hơn mọi phần tử cuối -> kéo dài dãy dài nhất
        else *it = x;                              // thay bằng x nhỏ hơn: dễ nối thêm về sau
    }
    cout << tail.size() << '\n';
    return 0;
}
