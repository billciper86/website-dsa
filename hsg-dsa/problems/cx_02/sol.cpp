// Cặp chia hết - Lời giải chuẩn O(n + k): đếm theo số dư
// [BƯỚC 1] Khung chương trình
// > Nạp thư viện, viết hàm main và bật đọc/ghi nhanh. Bước này bài nào cũng giống nhau.
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    // [BƯỚC 2] Đọc n, k
    // > Đọc hai số đầu tiên.
    int n, k;
    cin >> n >> k;
    // [BƯỚC 3] Đếm số dư
    // > Tạo mảng cnt có k ô; đọc từng số a và tăng cnt[a % k]. Ta chỉ quan tâm số dư, không cần nhớ cả dãy.
    vector<long long> cnt(k, 0);          // cnt[r] = có bao nhiêu số chia k dư r
    for (int i = 0; i < n; i++) {
        long long a;
        cin >> a;
        cnt[a % k]++;
    }
    // Chọn 2 phần tử từ x phần tử: x*(x-1)/2 (long long vì x tới 2e5 -> ~2e10)
    // [BƯỚC 4] Ghép các nhóm số dư
    // > Dư 0 ghép với dư 0, dư r ghép với dư k − r. Nếu k chẵn thì dư k/2 ghép với chính nó. Đếm cặp trong một nhóm có x phần tử là x(x − 1)/2.
    auto C2 = [](long long x) { return x * (x - 1) / 2; };
    long long ans = C2(cnt[0]);           // dư 0 ghép với dư 0
    for (int r = 1; r < k - r; r++)       // dư r ghép với dư k-r (r < k-r để không đếm 2 lần)
        ans += cnt[r] * cnt[k - r];
    if (k % 2 == 0 && k > 1)              // k chẵn: dư k/2 ghép với chính nó
        ans += C2(cnt[k / 2]);
    // [BƯỚC 5] In kết quả
    // > In ans (kiểu long long, vì có thể tới 2·10¹⁰).
    cout << ans << '\n';
    return 0;
}
