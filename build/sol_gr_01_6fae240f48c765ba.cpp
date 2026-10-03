// Lịch họp - Lời giải chuẩn: tham lam theo thời điểm kết thúc, O(n log n)
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<pair<long long, long long>> m(n);     // lưu (kết thúc, bắt đầu) để sort theo kết thúc
    for (auto &p : m) cin >> p.second >> p.first;
    sort(m.begin(), m.end());                    // kết thúc sớm nhất lên đầu
    long long lastEnd = -1;                      // thời điểm kết thúc của cuộc họp vừa chọn
    int cnt = 0;
    for (auto &[e, s] : m) {
        if (s >= lastEnd) {                      // ">=": được bắt đầu đúng lúc cuộc trước kết thúc
            cnt++;
            lastEnd = e;                         // chọn cuộc này: chừa lại nhiều thời gian nhất cho phía sau
        }
    }
    cout << cnt << '\n';
    return 0;
}
