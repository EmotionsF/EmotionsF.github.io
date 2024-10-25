---
title: 蓝桥杯-三国游戏
tags: 
    - C/C++
    - 蓝桥杯
    - 算法题
date: 2024-02-06 22:30:00
categories: knowledge
---

蓝桥杯2023年大学C组真题---三国游戏解法

<!-- more -->

### 导入

##### <font color=#871A99>可千万别瞧不起人家大专生，这可是大专组的题目</font>

这个程序涉及到了`sort` 函数和 `max()` `min()` 函数的用法，这些函数统统包括在标准库文件`<algorithm>`中。
之前有几个同学给我看过几个c语言的代码，问题都是在不经过定义的情况下直接调用`max`函数或者`min`函数，导致程序报错。但在C++中，如果引用了上面的标准库文件或者是万能标准库文件`<bits/stdc++.h>`之后，你就可以直接使用max或者min函数来返回最大或者最小的函数了。
`sort` 函数就是排序的函数，其中的形参中，第一个和第二个为指针，第三个则是排序规则，如果第三个形参保持空白，则默认以从小到大的方式排序。排序之后这两个指针之间的内存空间内数据会发生重新排列（也就是在原有的数据基础上进行操作）
例如，以下代码实现了对数组`a[100]`进行从小到大的排序：

```c++
#include<bits/stdc++.h>
//上面这个包括了C和C++的所有库函数，比赛用这个肯定没错

int main(){
    int a[100] = {0};
    for(int i=0;i<100;i++){
        cin >> a[i]; //输入函数
    }
    sort(a,a+100);
    for(int i=0;i<100;i++){
        cout << a[i]; //输出函数
    }
    return 0;
}
```

### 解题思路

本题运用到了贪心算法，具体可以在网上搜索对应的解释（b站一大堆）

```c++
#include <iostream> 
#include <algorithm>
typedef long long ll;
using namespace std;

int main() {
    int n;
    cin >> n;
    int Awin[n] = {0}, Bwin[n] = {0}, Cwin[n] = {0};
    int A[n] = {0}, B[n] = {0}, C[n] = {0};
    for (int i = 0; i < n; i++) {
    	cin >> A[i];
    }
    for (int i = 0; i < n; i++) {
    	cin >> B[i];
    }
    for (int i = 0; i < n; i++) {
    	cin >> C[i];
        Awin[i] = A[i] - B[i] - C[i];
        Bwin[i] = B[i] - A[i] - C[i];
        Cwin[i] = C[i] - A[i] - B[i];
    }
    sort(Awin, Awin + n);
    sort(Bwin, Bwin + n);
    sort(Cwin, Cwin + n);
    ll a = 0, b = 0, c = 0;
    int X = 0, Y = 0, Z = 0;
    for (int i = 0; i < n; i++) {
        a += Awin[n - i - 1];
        if (a <= 0)
            break;
            X++;
    }
    for (int i = 0; i < n; i++) {
        b += Bwin[n - i - 1];
        if (b <= 0)
            break;
            Y++;
    }
    for (int i = 0; i < n; i++) {
        c += Cwin[n - i - 1];
        if (c <= 0)
            break;
            Z++;
    }
    int infer = max(max(X,Y),Z);
    if(infer>0){
        cout << infer;
    }else{
        cout << -1;
    }
    return 0;
}
```