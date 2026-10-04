#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int a,b,k;
    int t;
    cin >> a;
    cin >> b; cin >> k;
    for (int i = a; i <= b+1; i++)
    {
        if (i % k == 0)
        {
            cout << i;
        }
    }
    return 0;
}
