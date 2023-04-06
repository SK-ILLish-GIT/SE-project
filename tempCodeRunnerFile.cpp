#include<bits/stdc++.h>
using namespace std;
typedef long long ll;
ll hcf(ll a,ll b){if(a==0){return b;}hcf(b%a,a);}
ll lcm(ll a,ll b){return (a/hcf(a,b))*b;}

set<ll> s;
vector<ll> fibonacci;

bool isFibonacci(int n)
{
    return s.find(n)!=s.end();
}

bool helperleft(int x,int y,int r,int c){
    // if(x-2<0 || y-1<0 || r-x<0 || c-y<0){
    //     return false;
    // }
    return isFibonacci(x-2) && isFibonacci(y-1) && isFibonacci(r-x) && isFibonacci(c-y);
}
bool helperright(int x,int y,int r,int c){
    // if(x+2>r || y-1<0 || r-x<0 || c-y<0){
    //     return false;
    // }
    return isFibonacci(x+2) && isFibonacci(y-1) && isFibonacci(r-x) && isFibonacci(c-y);
}
bool helperup(int x,int y,int r,int c){
    // if(x-1<0 || y-2<0 || r-x<0 || c-y<0){
    //     return false;
    // }
    return isFibonacci(x-1) && isFibonacci(y-2) && isFibonacci(r-x) && isFibonacci(c-y);
}
bool helperdown(int x,int y,int r,int c){
    // if(x-1>r || y-1<0 || r-x<0 || c-y-1<0){
    //     return false;
    // }
    return isFibonacci(x-1) && isFibonacci(y-1) && isFibonacci(r-x) && isFibonacci(c-y-1);
}

void solve(){
    int n,x,y;
    cin>>n>>x>>y;
    int h = fibonacci[n];
    int w = fibonacci[n+1];
    bool ans = helperleft(x,y,w,h) || helperright(x,y,w,h) || helperup(x,y,w,h) || helperdown(x,y,w,h);
    if(ans){
        cout<<"YES"<<endl;
    }
    else{
        cout<<"NO"<<endl;
    }
}

int main(){
ios_base::sync_with_stdio(false); cin.tie(0); cout.tie(0);
ll a=1,b=1;
for(int i=0;i<44;i++){
    s.insert(a+b);
    fibonacci[i]=a+b;
    int temp=a+b;
    a=b;
    b=temp;
}
ll t=1;
cin>>t;
while(t--){
    solve();
}
return 0;
}