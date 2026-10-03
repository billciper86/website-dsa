// Máy in - Lời giải TRÂU: mô phỏng từng bản in bằng hàng đợi ưu tiên, O(m log n): qua subtask 1
// KY_VONG: 30
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n; long long m; cin >> n >> m;
    // (thời điểm máy in xong bản tiếp theo, thời gian 1 bản)
    priority_queue<pair<long long, long long>, vector<pair<long long, long long>>, greater<>> pq;
    for (int i = 0; i < n; i++) { long long x; cin >> x; pq.push({x, x}); }
    long long last = 0;
    for (long long c = 0; c < m; c++) {          // giao bản tiếp theo cho máy xong sớm nhất
        auto [fin, x] = pq.top(); pq.pop();
        last = fin;
        pq.push({fin + x, x});
    }
    cout << last << '\n';
}
