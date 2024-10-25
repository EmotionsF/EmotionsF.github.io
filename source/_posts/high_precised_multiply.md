---
title: 蓝桥杯——高精度平方差
tags:
    - C/C++
    - Python
    - 蓝桥杯
    - 算法题
date: 2024-02-19 16:03:00
categories: knowledge
---

#### Python 秒 默 全

<!-- more -->

## 导入

很多人喜欢用计算机来计算特别大的数据，比如使用科学计数法之后右上角需要写的指数是几百上千的那种。但是，计算机的数据类型限制了我们计算的最大数字大小。
即使是最大的long long数据类型，最大也只有9223372036854775807，即2的63次方减1
这对于野心家来说肯定远远不够，所以我们就需要更加精确的能够计算成百上千位数据的算法。


先奉上用C++写的高精度算法代码：

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

bool cmp(vector<int> &a, vector<int> &b) { //这个函数用于比较数组大小
	if (a.size() != b.size())
		return a.size() > b.size();
	for (int i = a.size() - 1; i >= 0; i--) { //长度相等时，从前到后逐个比较元素大小
		if (a[i] != b[i])
			return a[i] > b[i];
	}
	return true;
}

// 大整数相乘
vector<int> multiply(vector<int> &A, vector<int> &B) {
	vector<int> C(A.size() + B.size());
	for (int i = 0; i < A.size(); i++) {
		for (int j = 0; j < B.size(); j++) {
			C[i + j] += A[i] * B[j]; //先相乘
		}
	}
	for (int i = 0, t = 0; i < C.size(); i++) {
		t += C[i];
	    C[i] = t % 10;
		t /= 10; //后进位
	}
	while (C.size() > 1 && C.back() == 0)
		C.pop_back(); //去除前导0，便于之后结果的逆序输出
	return C;
}

// 大整数相减
vector<int> subtract(vector<int> &a, vector<int> &b) {
	int al = a.size(), bl = b.size();
	vector<int> c(max(al, bl), 0); // 结果数组
	for (int i = 0; i < max(al, bl); i++) {
		if (i < al) {
			a[i] -= (i < bl ? b[i] : 0);
		}
		if (a[i] < 0) {
			a[i + 1]--;
			a[i] += 10;
		}
		c[i] = a[i];
	}
	while (!c.empty() && c.back() == 0) {
		c.pop_back(); // 去除前导零
	}
	return c;
}

int main() {
	string str1, str2, st1, st2;
	cin >> str1 >> str2;
	vector<int> A, B;
	if (str1[0] == '-') { //判断是否为负数
		for (int i = 1; i < str1.size(); i++) {
			st1 += str1[i];
		}
	} else {
		st1 = str1;
	}
	if (str2[0] == '-') {
		for (int i = 1; i < str2.size(); i++) {
			st2 += str2[i];
		}
	} else {
		st2 = str2;
	}
	for (int i = st1.size() - 1; i >= 0; i--) {
		A.push_back(st1[i] - '0');
	}
	for (int i = st2.size() - 1; i >= 0; i--) {
		B.push_back(st2[i] - '0');
	}
	vector<int> sg1 = multiply(A, A);
	vector<int> sg2 = multiply(B, B);
	vector<int> output;
	if (cmp(sg1, sg2))
		output = subtract(sg1, sg2);
	else {
		cout << '-';
		output = subtract(sg2, sg1);
	}
	for (int i = output.size() - 1; i >= 0; i--) {
		cout << output[i];
	}
	cout << endl;
	return 0;
}
```
上面是我写的竞赛代码，花了我将近5个小时才解决精度不够的问题（即使并非我完全原创）
大致思路就是采用小学的模拟列竖式的方法进行运算，每一位的结果单独储存到数组或者字符串的一个元素里面，然后进行求和并进位。
之前还尝试过使用平方差公式 $a^2-b^2 = (a+b)(a-b)$
来进行计算，但是我发现这种方法处理结果的正负比较麻烦（容易出错），遂放弃。
具体的计算原理可以参考下列视频：（来源：bilibili）
{% raw %}
<div style="position: relative; width: 100%; height: 0; padding-bottom: 75%;">
<iframe src="//player.bilibili.com/player.html?aid=241083653&bvid=BV1Ne411v78Z&cid=1401768891&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" style="position: absolute; width: 100%; height: 100%; Left: 0; top: 0;" ></iframe></div>
{% endraw %}

这玩意写着写着脑子都要炸了。但是

### 现在，是见证奇迹的时刻

(下列是其它选手写的代码)

```python
import os
import sys
print(int(input())**2-int(input())**2)
```

```java
import java.math.BigInteger;
import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner scanner=new Scanner(System.in);
        BigInteger A=new BigInteger(scanner.next());
        BigInteger B=new BigInteger(scanner.next());
        A=A.multiply(A);
        B=B.multiply(B);
        System.out.println(A.subtract(B));
	}	
}
```
没错，python只是用了最基础的原生库就搞定了高精度算法，而java也有对应的针对大数运算的标准库。
C++选手骂骂咧咧的退出了比赛。