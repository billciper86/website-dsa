#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n,k;
    cin >> n >> k;
    vector<long long> a(n+1,0);
    for (int i = 0; i <= n; i++)
    {
        cin >> a[i];
    }
    map<long long, long long> cnt;
    cnt[0] = 1;
    long long p=0, ans = 0;
    for (int i=1; i <= n; i++)
    {
        p += a[i];
        if(cnt.count(p-k)) ans += cnt[p-k]
        cnt[p]++;
    }
}
