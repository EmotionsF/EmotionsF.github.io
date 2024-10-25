---
title: 电子科技协会第二次授课教案
tags:
    - C/C++
    - Python
    - 电子科技协会授课
    - 算法题
date: 2024-10-25 21:00:00
categories: knowledge
---

玄不救非，氪不改命，唯有实践，方出真知

<!-- more -->

## 导入

某一天你启动元神，发现你需要完成四个委托才能获得60原石，这四个委托的名字和完成时间分别是：
> ——奇怪的丘丘人  5分钟
> ——会飞的史莱姆  3分钟
> ——至冬国的商人  8分钟
> ——蒙德快递小哥  5分钟

请问，需要多长的时间才能完成这四个委托？
完成这些委托的顺序有几种？

<br>

然而现实情况是，我们不可能完全按照前面一页的时间来完成这些元神委托。
因为在打委托的过程中，因为不同的委托之间的距离不同，
从一个委托完成到开始进行另一个委托所需要的时间也会不一样。

这个时候我们或许可以引入另外一种属性，就是往来两个委托所需的时间T_D，与完成委托所需要的时间T一起进行计算。
假设不同委托之间切换所需时间如下，每个委托之间的往来时间一致：

| 下面为后者，右面为前者 | 奇怪的丘丘人 | 会飞的史莱姆 | 至冬国的商人 | 蒙德快递小哥 |
| -----------          | ----------- | ----------- |-----------  |----------- |
| 奇怪的丘丘人          | \           |        3     |       5      |       4     |
| 会飞的史莱姆          |    3     |    \        |       5      |       5     |
| 至冬国的商人          |       5      |       5      |  \          |       3     |
| 蒙德快递小哥          |       4      |       5      |       3      | \          |

这个时候上一页你们采用的方法是不是计算量大大增加了？

这里有一个参考的算法（暴力穷举法）来实现的解法：

```c

#include <stdio.h>
#include <string.h>

#define NUM_TASKS 4

// 委托名称
char *tasks[] = {"奇怪的丘丘人", "会飞的史莱姆", "至冬国的商人", "蒙德快递小哥"};

// 完成时间
int completion_times[] = {5, 3, 8, 5};

// 切换时间表 (对角线不使用，因此初始化为0)
int transition_times[NUM_TASKS][NUM_TASKS] = {
	{0, 3, 5, 4}, // 奇怪的丘丘人
	{3, 0, 5, 5}, // 会飞的史莱姆
	{5, 5, 0, 3}, // 至冬国的商人
	{4, 5, 3, 0}  // 蒙德快递小哥
};

// 交换函数，用于生成全排列
void swap(int *a, int *b) {
	int temp = *a;
	*a = *b;
	*b = temp;
}

/* 思考题：为什么交换函数的参数要加上指针呢？*/

// 计算总时间
int calculate_total_time(int path[]) {
	int total_time = 0;
	for (int i = 0; i < NUM_TASKS - 1; i++) { //用来完成四个委托的循环
		total_time += completion_times[path[i]];  // 委托完成时间
		total_time += transition_times[path[i]][path[i + 1]]; // 切换时间
	}
	total_time += completion_times[path[NUM_TASKS - 1]]; // 最后一个委托的完成时间
	return total_time;
}

// 全排列递归函数
void find_shortest_path(int path[], int start, int *shortest_time, int best_path[]) {
	if (start == NUM_TASKS - 1) {
		int current_time = calculate_total_time(path);
		if (current_time < *shortest_time) {
			*shortest_time = current_time;
			// 手动复制路径
			for (int i = 0; i < NUM_TASKS; i++) {
				best_path[i] = path[i];
			}
		}
		return;
	}

	for (int i = start; i < NUM_TASKS; i++) {
		swap(&path[start], &path[i]);
		find_shortest_path(path, start + 1, shortest_time, best_path);
		swap(&path[start], &path[i]);
	}
}

int main() {
	int path[NUM_TASKS] = {0, 1, 2, 3};  // 初始路径
	int best_path[NUM_TASKS];
	int shortest_time = 9999;

	// 找到最短路径
	find_shortest_path(path, 0, &shortest_time, best_path);

	// 输出结果
	printf("最短路径: ");
	for (int i = 0; i < NUM_TASKS; i++) {
		printf("%s ", tasks[best_path[i]]);
	}
	printf("\n总时间: %d 分钟\n", shortest_time);

	return 0;
}

```

## 递归函数

**“我启动我自己”**

递归函数的意思就是，函数不停地调用自身直到符合函数不再继续调用的条件满足以后将最后一次调用的函数的值不断地向上一级函数返回，最终会返回第一次调用这个函数时候的返回值
很多算法就是以这种函数调用模式为核心的，比如深度搜索（DFS）、广度搜索（BFS）、动态规划等

下面是一个深度搜索的示例：
假设我们有一个无向图，如下所示：

```mathematica

    A
   / \
  B   C
 / \   \
D   E   F

```
图的邻接表表示如下：

```python
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B'],
    'F': ['C']
}
```
用C语言深度优先搜索的实现如下：

```c

#include <stdio.h>
#include <stdlib.h>

#define MAX_VERTICES 6

typedef struct Node {
    int vertex;
    struct Node* next;
} Node;

typedef struct Graph {
    Node* adjLists[MAX_VERTICES];
    int visited[MAX_VERTICES];
} Graph;

// 创建图
Graph* createGraph() {
    Graph* graph = malloc(sizeof(Graph));
    for (int i = 0; i < MAX_VERTICES; i++) {
        graph->adjLists[i] = NULL;
        graph->visited[i] = 0; // 初始化未访问
    }
    return graph;
}

// 添加边
void addEdge(Graph* graph, int src, int dest) {
    Node* newNode = malloc(sizeof(Node));
    newNode->vertex = dest;
    newNode->next = graph->adjLists[src];
    graph->adjLists[src] = newNode;

    // 无向图，添加反向边
    newNode = malloc(sizeof(Node));
    newNode->vertex = src;
    newNode->next = graph->adjLists[dest];
    graph->adjLists[dest] = newNode;
}

// 深度优先搜索
void dfs(Graph* graph, int vertex) {
    graph->visited[vertex] = 1; // 标记为已访问
    printf("%d ", vertex); // 处理当前节点

    Node* adjList = graph->adjLists[vertex];
    while (adjList != NULL) {
        int connectedVertex = adjList->vertex;
        if (!graph->visited[connectedVertex]) {
            dfs(graph, connectedVertex);
        }
        adjList = adjList->next;
    }
}

int main() {
    Graph* graph = createGraph();

    // 添加边，假设 A=0, B=1, C=2, D=3, E=4, F=5
    addEdge(graph, 0, 1); // A-B
    addEdge(graph, 0, 2); // A-C
    addEdge(graph, 1, 3); // B-D
    addEdge(graph, 1, 4); // B-E
    addEdge(graph, 2, 5); // C-F

    printf("Depth First Search starting from vertex A (0):\n");
    dfs(graph, 0);

    // 释放内存（这里省略了内存释放的部分，实际使用中应当添加）

    return 0;
}

```

如果上面的理解不了，这里有我自己编写的一个利用递归算法实现的从一数到十的算法（不管输入多少都能输出固定值10）：

```c

#include <stdio.h>

int CountToTen(int x) {
	int i = x;
	if (i < 10) {
		return CountToTen(i + 1);
	} else if (i > 10) {
		return CountToTen(i - 1);
	} else {
		return x;
	}
}

int main() {
	printf("%d\n", CountToTen(100));
	printf("%d\n", CountToTen(1));
	return 0;
}

```

## 云元神

小明自元神发售的那一天起，就非常想要玩元神，但是非常遗憾的就是高考毕业之后爸妈不给他买手机电脑，只能用原有的破手机破电脑，舍友也不舍得给他玩，无奈他只能眼巴巴地看着室友提升到了很高的练度
直到有一天，他看到元神的云端版——云元神，终于发售了。他非常兴奋，觉得从此以后它也可以玩元神了，于是直接就下载了它。但是他不知道的是，由于云元神过于火爆，每天到他能玩元神的时间的时候，前面都有超过一百个以上的人在排队。
小明恼火至极，发誓从此以后和元神不共戴天，再也不玩元神了。
请问你知道是什么东西导致小明需要排队而玩不了元神吗？

## 结构体和链表

结构体是由多个不同属性的元素组成的集合，链表是由指针连接起来的一串结构体。

小明排队的时候所在的就是一种名为“队列（Queue）”的数据结构体，它的特点是：数据只能从尾部进入，从头部弹出。
举个例子，食堂排队。
与之相对的还有一种数据结构，那就是栈（Stack）。它的特点是只能从尾部进入，也只能从尾部弹出。

在C语言中，如果需要实现上述的两个数据结构，就需要掌握结构体和链表的基本知识。

下面是一个用结构体实现的队列的算法的示例：

```c

#include <stdio.h>
#include <stdlib.h>

#define MAX 5  // 定义队列的最大容量

// 定义队列结构体
struct Queue {
    int items[MAX];
    int front;
    int rear;
};

// 初始化队列
void initQueue(struct Queue* q) {
    q->front = -1;
    q->rear = -1;
}

// 检查队列是否为空
int isEmpty(struct Queue* q) {
    if (q->front == -1) {
        return 1;
    } else {
        return 0;
    }
}

// 检查队列是否已满
int isFull(struct Queue* q) {
    if (q->rear == MAX - 1) {
        return 1;
    } else {
        return 0;
    }
}

// 入队操作
void enqueue(struct Queue* q, int value) {
    if (isFull(q)) {
        printf("队列已满，无法添加元素 %d\n", value);
    } else {
        if (q->front == -1) {  // 如果队列为空，设置 front 为 0
            q->front = 0;
        }
        q->rear++;
        q->items[q->rear] = value;
        printf("元素 %d 已添加到队列\n", value);
    }
}

// 出队操作
int dequeue(struct Queue* q) {
    int item;
    if (isEmpty(q)) {
        printf("队列为空，无法执行出队操作\n");
        return -1;
    } else {
        item = q->items[q->front];
        q->front++;
        if (q->front > q->rear) {  // 重置队列为空状态
            q->front = q->rear = -1;
        }
        printf("元素 %d 已从队列移除\n", item);
        return item;
    }
}

// 打印队列
void display(struct Queue* q) {
    if (isEmpty(q)) {
        printf("队列为空\n");
    } else {
        printf("队列: ");
        for (int i = q->front; i <= q->rear; i++) {
            printf("%d ", q->items[i]);
        }
        printf("\n");
    }
}

int main() {
    struct Queue q;
    initQueue(&q);

    enqueue(&q, 10);
    enqueue(&q, 20);
    enqueue(&q, 30);
    display(&q);  // 输出队列状态

    dequeue(&q);
    display(&q);  // 输出队列状态

    return 0;
}

```

## 拉清单

由于小明的舍友玩元神玩上瘾了，准备问小明借钱充值648。小明非常难受，但是出于面子又不得不把钱借给他们充值元神。然而，过了半年，这几个室友仍然没有还钱。
直到有一天，老师布置了一个设计C语言程序的任务，要求小明设计程序输出一个可以打开的文档。小明非常高兴，决定把借钱的人做成一个列表，并输出给全班同学看，以此来逼迫舍友还钱。

> 以下同学为了充值元神欠我648元人民币，名单如下：
>> 张三
>> 李四
>> 王五
>> 老六

<br>

## 文件操作

如果一个程序只能在它自身的范围内进行操作而不能够输出任何数据，那这个程序又有什么意义呢？这个程序是用来自娱自乐的吗？
文件类型的输出依靠一种特殊类型的指针——FILE类型。这种类型的指针允许我们将其指向一个文件（目前我们只需要知道文本类型即可）。通过这种类型的指针我们可以对文件进行增加内容、删除、新建等操作。

常见对文件内容操作的函数有：

`FILE *fopen(const char *filename, const char *mode);`

用于打开文件。mode 指定打开方式，如 "r"（读）、"w"（写）、"a"（追加）、"rb"（以二进制读方式打开）、"wb"（以二进制写方式打开）等。

`int fclose(FILE *stream);`

用于关闭文件，释放资源。

`size_t fread(void *ptr, size_t size, size_t count, FILE *stream);`

从文件中读取二进制数据到内存。ptr 指向读取内容的缓冲区，size 是每个数据项的字节数，count 是读取项数，stream 是文件指针。

`size_t fwrite(const void *ptr, size_t size, size_t count, FILE *stream);`

把内存中的二进制数据写入文件。

`int fprintf(FILE *stream, const char *format, ...);`

以格式化字符串的方式写入数据到文件。

`int fscanf(FILE *stream, const char *format, ...);`

从文件读取格式化数据。

`int fputc(int char, FILE *stream);`

将一个字符写入文件。

`int fgetc(FILE *stream);`

从文件中读取一个字符。

`int fputs(const char *str, FILE *stream);`

将字符串写入文件。

`char *fgets(char *str, int n, FILE *stream);`

从文件读取一行字符串。

下面是一个示例的程序（用来输出小明拉的清单）：

```c 

#include <stdio.h>
#include <stdlib.h>

int main() {
	FILE *file;
	char *filename = "Xiaoming's_List.txt";

	// 1. 创建并打开文件 (写模式)
	file = fopen(filename, "w");
	if (file == NULL) {
		printf("创建文件失败。\n");
		return 1;
	}

	// 2. 向文件写入内容
	fprintf(file, "以下同学为了充值元神欠我648元人民币，名单如下：\n");
	fprintf(file, "张三\n");
	fprintf(file, "李四\n");
	fprintf(file, "王五\n");
	fprintf(file, "老六\n");
	fclose(file);  // 写入完成后关闭文件

	// 3. 重新打开文件 (读模式)
	file = fopen(filename, "r");
	if (file == NULL) {
		printf("无法打开文件。\n");
		return 1;
	}

	// 4. 读取文件内容并打印到控制台
	char line[256];
	while (fgets(line, sizeof(line), file)) {
		printf("%s", line);
	}

	// 5. 关闭文件
	fclose(file);

	return 0;
}

```

## （选做）课后作业

小明的命运太悲惨了，让我们完成它在元神里抽卡的心愿吧。
大家可以用C语言做一个抽卡模拟器，要求将抽卡结果输出到一个文本文档中。
提示：可以引入 `srand()` 函数来决定随机数种子（使用前引入库函数 `<stdlib.h>`），引入库函数 `<time.h>` 来获取系统时间并将其作为随机数种子，然后使用 `rand()` 函数来生成一个随机数。由于默认生成的随机数在0-32767之间，所以输出的结果需要将其和100进行取余运算之后再+1，才可以输出一个1到100之间的随机数。

