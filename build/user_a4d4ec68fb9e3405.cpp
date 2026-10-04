#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n,k;
    cin >> n >> k;
    vector<long long> a(n+1,0);
    for (int i = 1; i <= n; i++)
    {
        int x;
        cin >> x;
        a[i] = a[i-1] + x;
    }
    int l = 0;
    int cnt = 0;
    for (int r = n; r >= l; r--)
    {
        if (a[r] - k)
        {
            cnt++;
        }
    }
    cout << cnt;
    return 0;
}
