// Lịch họp - Lời giải chuẩn: tham lam theo thời điểm kết thúc, O(n log n)
// [BƯỚC 1] Khung chương trình
// > Nạp thư viện, viết hàm main và bật đọc/ghi nhanh. Bước này bài nào cũng giống nhau.
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    // [BƯỚC 2] Đọc và lưu (kết thúc, bắt đầu)
    // > Lưu pair (e, s) để sort mặc định theo e.
    int n;
    cin >> n;
    vector<pair<long long, long long>> m(n);     // lưu (kết thúc, bắt đầu) để sort theo kết thúc
    for (auto &p : m) cin >> p.second >> p.first;
    // [BƯỚC 3] Sắp theo thời điểm kết thúc
    sort(m.begin(), m.end());                    // kết thúc sớm nhất lên đầu
    // [BƯỚC 4] Chọn tham lam
    // > Duyệt lần lượt: nếu s ≥ lastEnd thì chọn cuộc họp và cập nhật lastEnd = e.
    long long lastEnd = -1;                      // thời điểm kết thúc của cuộc họp vừa chọn
    int cnt = 0;
    for (auto &[e, s] : m) {
        if (s >= lastEnd) {                      // ">=": được bắt đầu đúng lúc cuộc trước kết thúc
            cnt++;
            lastEnd = e;                         // chọn cuộc này: chừa lại nhiều thời gian nhất cho phía sau
        }
    }
    // [BƯỚC 5] In kết quả
    cout << cnt << '\n';
    return 0;
}
