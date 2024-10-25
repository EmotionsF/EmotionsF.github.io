---
title: 蓝桥杯-飞机降落问题解法
tags: 
    - C/C++
    - 蓝桥杯
    - 算法题
date: 2024-02-06 22:30:00
categories: knowledge
---

蓝桥杯2023年大学B组真题---飞机降落解法

<!-- more -->

## 导入

说实在的我这个人并不是非常精通深搜广搜的知识，但是我在之前c语言课上打印杨辉三角的时候就用到了搜索解题的基础———递归调用。
由于C++具有【动态数组】vector容器，能够根据元素数量自动调整大小，我们可以利用这一特性，对数量未知的数据进行处理。
而且vector支持用函数直接对其进行修改，而不像其它数据一样只能传入指针或者作为副本传入。（虽然其它的数据也能传指针然后修改它，但这样相比vector这个还是麻烦了些）
#### <font color=#871A99>强烈建议要打蓝桥杯的学C++！因为真的太好用了ㄟ(≧◇≦)ㄏ</font>

## 解题思路

**DFS** 
如果当前遍历的飞机编号 cnt 等于飞机数量 n，表示所有飞机都已经安全降落，返回 true。 遍历每一架飞机，如果当前飞机未被使用（false）：

1. 设置当前飞机状态为已使用（down[i] = true）。
2. 判断是否在规定时间内开始降落，如果不是，则回溯并返回 false。
3. 递归调用 dfs 处理下一架飞机，如果返回 true，表示可以成功安排降落，直接返回 true。
4. 回溯，如果遍历完所有飞机都未找到合适的安排，返回 false。

```c++
#include <iostream>
#include <vector>
using namespace std;

struct airplane {
    int T;
    int D;
    int L;
};

bool dfs(int total, int cnt, int last, vector<airplane> &plane, vector<bool> &down) {
    if (total == cnt) {
        return true;
    }
    for (int i = 0; i < total; i++) {
        if (down[i] == false && plane[i].T + plane[i].D >= last) {
            down[i] = true;
      if (dfs(total, cnt + 1, max(last, plane[i].T) + plane[i].L, plane, down)) {
                return true;
            }
            down[i] = false;
        }
    }
    return false;
}

int main() {
    int Total;
    cin >> Total;
    while (Total--) {
        int N;
        cin >> N;
        vector<airplane> plane(N);
        vector<bool> down(N, false); 
        for (int i = 0; i < N; i++) {
            cin >> plane[i].T >> plane[i].D >> plane[i].L;
        }
        if (dfs(N, 0, 0, plane, down)) {
            cout << "YES" << endl;
        } else {
            cout << "NO" << endl;
        }
    }

    return 0;
}
```

## 注意

蓝桥杯比赛的程序运行时间是有限制的，如果程序运行超过了规定的时间后仍然没有输出正确结果，就会被判定为超时，和“答案错误”是一样的。这道题限定的时间是两秒钟，虽然比较充裕，但我第一次做的时候还是超时了（雾