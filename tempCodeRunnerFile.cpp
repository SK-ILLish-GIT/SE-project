#include<bits/stdc++.h>
using namespace std;
typedef long long ll;
bool isPerfectSquare(long double x){if (x >= 0) {long long sr = sqrt(x);return (sr * sr == x);}return false;}
ll hcf(ll a,ll b){if(a==0){return b;}hcf(b%a,a);}
ll lcm(ll a,ll b){return (a/hcf(a,b))*b;}

bool cmp(pair<ll,ll> &a,pair<ll,ll> &b){
    return a.first>b.first;
}

void solve(){
    ll n,k;
    cin>>n>>k;
    multiset<ll> s;
    vector<pair<ll,ll>> arr;
    for(ll i=0;i<n;i++){
        ll m,v;
        cin>>m>>v;
        arr.push_back({v,m});
    }
    for(int i=0;i<k;i++){
        int m;
        cin>>m;
        s.insert(m);
    }
    sort(arr.begin(),arr.end(),cmp);
    ll ans=0;
    ll num=0;
    for(ll i=0;num<=k && i<n;i++){
        auto it = lower_bound(s.begin(),s.end(),arr[i].second);
        if(it!=s.end()){
            ans+=arr[i].first;
            num+=1;
            s.erase(it);
        }
    }
    cout<<ans<<endl;
}


int main(){
ios_base::sync_with_stdio(false); cin.tie(0); cout.tie(0);
ll t=1;
// cin>>t;
while(t--){
solve();
}
return 0;
}