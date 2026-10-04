#include <bits/stdc++.h>
using namespace std;
using ll = long long;
int main()
{
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    map(ll,ll) cnt;
    cnt[0] = 1;
    long long p = 0, ans=0;
    for (int i = 1; i <= n; i++)
    {
        long long a; 
        cin >> a; // thay the cho a[i]
        p += a; // a[i]
        auto it = cnt.find(p-k)
        if(it != cnt.end())
        {
            ans += it->second;
        }
        cnt[p]++;
    }
    cout << ans << '\n';
}