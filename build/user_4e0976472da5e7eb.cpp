// Đoạn ít màu - Lời giải chuẩn: cửa sổ trượt + map đếm, O(n log n)
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, K;
    cin >> n >> K;
    vector<int> a(n);
    for (auto &x : a) cin >> x;
    map<int, int> cnt;          // cnt[màu] = số bóng màu đó trong cửa sổ [l, r]
    int l = 0, best = 0;
    for (int r = 0; r < n; r++) {
        cnt[a[r]]++;                            // thêm bóng r
        while ((int)cnt.size() > K) {           // quá K màu -> bỏ bớt bên trái
            if (--cnt[a[l]] == 0) cnt.erase(a[l]);   // màu hết hẳn thì XÓA khỏi map
            l++;
        }
        best = max(best, r - l + 1);
    }
    cout << best << '\n';
    return 0;
}
