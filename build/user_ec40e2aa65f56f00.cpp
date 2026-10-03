#include <bits/stdc++.h>
using namespace std;
int S[505][505];
int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m,q;cin>>n>>m>>q;
for(int i=1;i<=n;i++)for(int j=1;j<=m;j++){int a;cin>>a;S[i][j]=a+S[i-1][j]+S[i][j-1]-S[i-1][j-1];}
while(q--){int a,b,c,d;cin>>a>>b>>c>>d;cout<<S[c][d]-S[a-1][d]-S[c][b-1]+S[a-1][b-1]<<'\n';}}