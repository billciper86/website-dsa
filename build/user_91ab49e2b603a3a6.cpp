#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n,k;
    cin >> n >> k;
    map<long long,long long> cnt;
    cnt[0] = 1;
    long long p = 0, ans = 0;
    for (int i = 1; i <= n; i++)
    {
        long long a;
        cin >> a;
        p += a;
        auto it = cnt.find(p-k);
        {
            if (it != cnt.end())
            {
                ans += it->second;
                cnt[p]++;
            }
        }
    }
    cout << ans << '\n';
    return 0;
}
