---
title: 有关本人博客评论区的一些使用教程
tags: 
    - 使用教程
date: 2024-02-03 17:48:00
categories: knowledge
pinned: 8
---

**评论前必看**

<!-- more -->

24.6.24更新
之前的评论系统waline后端炸了，所以评论系统已经紧急替换成了Twikoo，功能和使用方法和waline基本一致

本文主要讲述的就是如何使用markdown语法进行评论

##### 以下大部分内容源自[markdown中国官网](https://markdown.com.cn/basic-syntax),本文只转载部分常用的评论语法。

---

## 1️ Markdown 标题和文字
请先看如下文字演示：

# 一级标题

## 二级标题

### 三级标题

<br>


**这个是粗体**

*这个是斜体*

***这个是粗体加斜体***

~这里想用删除线~~

上文对应的输入方式如下：

    # 一级标题

    ## 二级标题

    ### 三级标题


    **这个是粗体**

    *这个是斜体*

    ***这个是粗体加斜体***

    ~这里想用删除线~~

也就是说，文字前的#号多少用于调节标题大小；文字前面加*号可以用来改变文字形态。

## 2️ 代码块
如果在一个行内需要引用代码，只要用反引号（`）引起来就好，如下：

Use the `printf()` function.

上述文本输入时如下：

```
Use the `printf()` function.
```
在需要高亮的代码块的前一行及后一行使用三个反引号，同时**第一行反引号后面表示代码块所使用的语言**，如下：

```java
// FileName: HelloWorld.java
public class HelloWorld {
  // Java 入口程序，程序从此入口
  public static void main(String[] args) {
    System.out.println("Hello,World!"); // 向控制台打印一条语句
  }
}
```

上述文本输入时如下：

````
```java
// FileName: HelloWorld.java
public class HelloWorld {
  // Java 入口程序，程序从此入口
  public static void main(String[] args) {
    System.out.println("Hello,World!"); // 向控制台打印一条语句
  }
}
```
````

对于我们常用的一些编程语言，比如C、C++、python、Java、kotlin、go、javascript等，都是支持高亮的。但注意，C++在显示高亮的时候需要在开头 ``` 的后面写cpp。所有语言在高亮显示的时候都需要小写。
注意，由于评论系统原因，**代码缩进的时候不要使用tab键**（否则光标会跳转到下方的图标），推荐使用4个空格代替tab键进行缩进。

## 3️ 引用块
要创建块引用，请在段落前添加一个 > 符号。
比如：

> 我是引用块

实现方式如下：
```
> 我是引用块
```
块引用可以包含多个段落。为段落之间的空白行添加一个 > 符号。
> Dorothy followed her through many of the beautiful rooms in her castle.
>
> The Witch bade her clean the pots and kettles and sweep the floor and keep the fire fed with wood.

实现方式如下：
```
> Dorothy followed her through many of the beautiful rooms in her castle.
>
> The Witch bade her clean the pots and kettles and sweep the floor and keep the fire fed with wood.
```
注意：在引用结束后，接下来的文字需要和上面的文字之间多出一行，否则接下来的文字全部都会被引用。

## 4️ 换行

在一行的末尾添加两个或多个空格，然后按回车键,即可创建一个换行(`<br>`)
也可以在一句话的结尾加上`<br>`，来达到换行的效果。
用空格键或者tab键缩进段落是没有用的。
如果不愿在句子后面打两个空格，那就直接按回车吧，也是可以换行的。

示例：

  只因你太美。
我不曾忘记。

其中“只因你太美后面我加了一个tab，如上文所示，没有起到效果。
上文采用如下方式输入：

```
  只因你太美。 //加了tab
我不曾忘记
```
如果要换行多次，就换n次行加n-1个`<br>`就可以了。例如：

只因你太美。
<br>
我不曾忘记。

上方我换了两次行，输入方式如下：

```
只因你太美。
<br>
我不曾忘记。
```

## 懒得写了...其它的去官网查看吧zzz反正上面的也够用了