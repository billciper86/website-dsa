// Thuyền cứu hộ - Lời giải TRÂU: thử mọi cách ghép (đệ quy), qua subtask 1
// KY_VONG: 30
#include <bits/stdc++.h>
using namespace std;
int n; long long C; vector<long long> w; vector<bool> used;
int best = INT_MAX;
void go(int boats) {
    if (boats >= best) return;
    int i = 0;
    while (i < n && used[i]) i++;
    if (i == n) { best = boats; return; }
    used[i] = true;
    go(boats + 1);                                  // i đi một mình
    for (int j = i + 1; j < n; j++)                 // i đi cùng j
        if (!used[j] && w[i] + w[j] <= C) { used[j] = true; go(boats + 1); used[j] = false; }
    used[i] = false;
}
int main() {
    cin >> n >> C; w.resize(n); used.assign(n, false);
    for (auto &x : w) cin >> x;
    go(0);
    cout << best << '\n';
}
