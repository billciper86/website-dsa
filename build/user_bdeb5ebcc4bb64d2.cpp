// Cái túi - Lời giải TRÂU: đệ quy thử lấy / không lấy từng món, O(2^n): qua subtask 1
// KY_VONG: 30
#include <bits/stdc++.h>
using namespace std;
int n; long long W; vector<long long> w, v;
long long best = 0;
void go(int i, long long sw, long long sv) {
    if (sw > W) return;                   // quá nặng: bỏ nhánh này
    if (i == n) { best = max(best, sv); return; }
    go(i + 1, sw, sv);                    // không lấy món i
    go(i + 1, sw + w[i], sv + v[i]);      // lấy món i
}
int main() {
    cin >> n >> W; w.resize(n); v.resize(n);
    for (int i = 0; i < n; i++) cin >> w[i] >> v[i];
    go(0, 0, 0);
    cout << best << '\n';
}
