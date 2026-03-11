---
title: C++ Basics
draft: false
tags:
---

### Vectors 

Basically dynamic arrays. Can add members to the end by `push_back()`, or remove by `pop_back()`. Can sort and search and do all sorts of stuffs with them. 

#### Declaration: 
`vector<int> v1;`
or, 
`vector<string> cars = {"Volvo", "BMW", "Ford", "Mazda"};`

```cpp
#include <bits/stdc++.h>
using namespace std;
int main()

{
	vector<int> v1;

  v1.push_back(1);
  v1.push_back(4);
  v1.push_back(2);
  v1.push_back(-1);
  v1.push_back(0);

  sort(v1.begin(), v1.end());
  
  for (int i = 0; i < v1.size(); i++) {
    cout << v1.at(i) << " ";
  }

  cout << "\n";
}
```



### Sets

Default Sets will always sort their members. `unordered` ones will not. But both will only have unique members, no duplicates. 

But `multiset` CAN have duplicate members, and will be sorted. 

#### Declaration: 
`set<int> st1;`
or, 
`set<string> cars = {"Volvo", "BMW", "Ford", "Mazda"};`



```cpp
#include <bits/stdc++.h>
#include <iostream>

using namespace std;

int main()
{
  set<int> st1;
  cout<<"normal set: "; 

  st1.insert(1);
  st1.insert(4);
  st1.insert(4);
  st1.insert(43);
  st1.insert(41);
  st1.insert(41);
  st1.insert(2);
  for (auto &it : st1) {
    cout << it << " ";
  }
  cout << "\n";


  unordered_set<int> st2;

  cout<<"unordered_set: "; 

  st2.insert(1);
  st2.insert(4);
  st2.insert(4);
  st2.insert(43);
  st2.insert(41);
  st2.insert(41);
  st2.insert(2);
  for (auto &it : st2) {
    cout << it << " ";
  }
  cout << "\n";


  multiset<int> st3;

  cout<<"multiset: "; 

  st3.insert(1);
  st3.insert(4);
  st3.insert(4);
  st3.insert(43);
  st3.insert(41);
  st3.insert(41);
  st3.insert(2);
  for (auto &it : st3) {
    cout << it << " ";
  }
  cout << "\n";
}
```

> [!Output: ]
> 	normal set: 1 2 4 41 43 
> 	unordered_set: 2 41 43 4 1
> 	multiset: 1 2 4 4 41 41 43


### Maps

Set of key and value pairs. In Normal ordered and unordered maps, keys and values are unique. 

```cpp
#include <bits/stdc++.h>
using namespace std;

int main()
{
  map<int, string> mp1;

  mp1[1] = "Ashik";
  mp1[26] = "Atif";
  mp1[4] = "Rafsan";

  for (auto &it : mp1) {
    cout << it.first << " " << it.second << "\n";
  }
}
```


> [!Output:]
> 1 Ashik
> 4 Rafsan
> 26 Atif


One can just define it as `unordered_map<int, string> mp1;` and then the keys won't be ordered. 


And now for multimaps: each members have to be inserted as pairs

```cpp
multimap<int, string> mmp1; 
pair<int, string>p1{1, "Ashik"};
mmp1.insert(p1);
```
Now there can be multiple values with same keys. But sorting of the keys DOES happen. 


---


# Important Functions: 


### Sorting and Reversing

```cpp
#include <bits/stdc++.h>
using namespace std;
int main()

{
	vector<int> v1;

  v1.push_back(1);
  v1.push_back(4);
  v1.push_back(2);
  v1.push_back(-1);
  v1.push_back(0);

  sort(v1.begin(), v1.end());
  reverse(v1.begin(), v1.end());
  
  for (int i = 0; i < v1.size(); i++) {
    cout << v1.at(i) << " ";
  }

  cout << "\n";
}
```


### Counting: 

`count(v1.begin(), v1.end(), 2)`: *counts the number of times element **2**  is present in the vector v1.*

you can also manipulate v1.begin() or v1.end() mathematically. e.g.: `v1.begin()+2` starts checking after first 2 elements. 


### Finding: Index, Max, Min

```cpp
#include <bits/stdc++.h>
using namespace std;

int main()
{
  vector<int> v1 = {2, 4, 1, -2, 5, 7};

  for(auto &it: v1) {
    cout << it << " "; 
  }
  cout << "\n"; 


  auto x = find(v1.begin(), v1.end(), 1); // gets the ADDRESS of the target element

  // cout << "Address of target element: " << x << "\n";
  // won't be able to print x 
  //*x will print 1

  // we CAN measure "distance" from the first element

  cout << "Target element is at index: " << distance(v1.begin(), x) << "\n"; 


  auto min = min_element(v1.begin(), v1.end()); 

  cout << "Minimum element is at index: " << distance(v1.begin(), min) << "\n"; 
  cout << "Minimum element is: " << *min << "\n"; 

  auto max = max_element(v1.begin(), v1.end()); 


  cout << "Maximum element is at index: " << distance(v1.begin(), max) << "\n"; 
  cout << "Maximum element is: " << *max << "\n"; 
}
```


> [!Output:]
> 2 4 1 -2 5 7 
> Target element is at index: 2
> Minimum element is at index: 3
> Minimum element is: -2
> Maximum element is at index: 5
> Maximum element is: 7


### Floor and Ceiling Function

```cpp
int x = (int)ceiling((float)5/7); // 1
int x = (int)ceiling((float)9/7); // 2
```

```cpp
int x = (int)floor((float)5/7); // 0
int x = (int)floor((float)9/7); // 1
```

The weird type-casting parts are due to the fact that the ceiling and floor function returns and accepts only float values. 


