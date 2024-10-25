---
title: 蓝桥杯-幸运数解法
tags: 
    - C/C++
    - 蓝桥杯
    - 算法题
date: 2024-02-06 22:30:00
categories: knowledge
---

蓝桥杯2023年大学A组真题---幸运数解法

<!-- more -->

还好数据要求不大，否则真的很容易超时（

```c++
#include <iostream>
using namespace std;

int main() {
    int score[5][37] = {0}; //定义数组表示第i位的和为j，最大为四九三十六
    int i = 0;
    for (int j = 1; j < 37; j++) {
        for (int k = 1; k < 10000; k++) {
            if (k > 0 && k < 10) { //一位数
                if (j == k) {
                    i = 1;
                    score[i][j]++;
                }
            } else if (k > 9 && k < 100) { //两位数
                i = 2;
                int a = k / 10;
                int b = k % 10;
                if (a + b == j) { //各位数字求和判断是否等于目标j
                    score[i][j]++;
                }
            } else if (k > 99 && k < 1000) { 
                i = 3;
                int a = k / 100;
                int b = (k / 10) % 10;
                int c = k % 10;
                if (a + b + c == j) {
                    score[i][j]++;
                }
            } else if (k > 999 && k < 10000) {
                i = 4;
                int a = k / 1000;
                int b = (k / 100) % 10;
                int c = (k / 10) % 10;
                int d = k % 10;
                if (a + b + c + d == j) {
                    score[i][j]++;
                }
            }
        }
    }
    long long sum = 0;
    for (int i = 1; i < 5; i++) { //前半部分
        for (int j = 1; j <= i * 9; j++) { 
            for (int k = 1; k <= i; k++) { //后半部分，可以往前面补0
                sum += score[i][j] * score[k][j];
            }
        }
    }
    cout << sum;
    return 0;
}
```