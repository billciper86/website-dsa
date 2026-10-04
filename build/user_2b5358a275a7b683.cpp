#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    long long n,q;
    cin >> n >> q;
    vector<long long> a;
    vector<long long> p(0,n+1);
    for (int i = 0; i < n; i++)
    {
        cin >> a[i];
    }
    for (int i = 1; i < n; i++)
    {
        p[i] = p[i-1] + a[i];
    }
    for (int i = 0; i < q; i++)
    {
        int l, r;
        cin >> l >> r;
        cout << p[r] - p[l-1] << endl;
    }
    return 0;
}
