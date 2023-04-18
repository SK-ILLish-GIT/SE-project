#include<bits/stdc++.h>
using namespace std;
typedef long long ll;
bool isPerfectSquare(long double x){if (x >= 0) {long long sr = sqrt(x);return (sr * sr == x);}return false;}
ll hcf(ll a,ll b){if(a==0){return b;}hcf(b%a,a);}
ll lcm(ll a,ll b){return (a/hcf(a,b))*b;}


ll merge(vector<ll> &arr,ll low,ll mid,ll high){
    ll i=low,j=mid+1,k=0,sum=0;
    vector<ll> temp(high-low+1);
    while(i<=mid && j<=high){
        if(arr[i]<arr[j]){
            sum+=(arr[i]*(high-j+1));
            temp[k++]=arr[i++];
        }
        else{
            temp[k++]=arr[j++];
        }
    }
    while(i<=mid){
        temp[k++]=arr[i++];
    }
    while(j<=high){
        temp[k++]=arr[j++];
    }
    for(ll i=low,k=0;i<=high;i++,k++){
        arr[i]=temp[k];
    }
    return sum;
}

ll mergeSort(vector<ll> &arr,ll low,ll high){
    if(low<high){
        ll mid = low+((high-low)/2);
        ll leftans = mergeSort(arr,low,mid);
        ll rightans = mergeSort(arr,mid+1,high);
        ll mergeans = merge(arr,low,mid,high);
        return leftans+rightans+mergeans;
    }
    return 0;
}

void solve(){
    ll n;
    cin>>n;
    vector<ll> arr(n);
    for(ll i=0;i<n;i++){
        cin>>arr[i];
    }
    cout<<mergeSort(arr,0,n-1)<<endl;
}


int main(){
ios_base::sync_with_stdio(false); cin.tie(0); cout.tie(0);
ll t=1;
cin>>t;
while(t--){
solve();
}
return 0;
}