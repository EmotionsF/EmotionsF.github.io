---
title: C语言程序——学生信息管理系统
tags: 
    - 算法思路
    - 实用工具
    - C/C++
date: 2024-3-20 17:48:00
categories: knowledge
top: true
pinned: 8
---

自己编写的学生管理器系统的部分代码实现
##### maybe 全网功能最多的C语言作业

<!-- more -->

## 前言

辅导员开学的时候给了我们当头一棒————不能用C++来编写学生管理器程序，导致我研究了一个寒假的只能用在C++上的库函数直接作废了。
但是，这没有关系。既然那些函数都不能用了，那不如自己动手，用c语言来实现C++的功能。
目前本程序可以实现的功能有：

> 1. 基本的学生管理的功能，有直观的主菜单，可以录入学生的信息，实现添加学生信息、显示学生信息、查找学生信息、删除学生信息、修改学生信息、保存学生信息以及退出等功能。存储方式的特色是动态数组和链式存储并行，极大的提高了存储灵活度。
> <br>
> 2. 排序功能，比如按总分对所有学生进行排序，按指定学科对学生成绩进行排序
> <br>
> 3. 绘制简单的学生成绩分布直方图（当然只能是控制台输出的那种）
> <br>
> 4. 显示总分或不同科目的最高分/最低分/平均分，并且统计不及格的人数及其占比
> <br>
> 5. 最多保存4种不同类型的科目信息和7份不同的学生成绩，支持删除信息以及合并学生成绩信息。
>  <br>
> 6. 所有的科目信息和成绩信息都可以自定义，并且可以随时查看。
> <br>
> 7. 支持重启软件，或者一键清除内存中的学生信息
> <br>
> 8. 还有可能会吓你一跳的彩蛋等你发现。

/* WARRING：本程序代码行数达到2973行，加上彩蛋头文件则达到3122行，谨慎全文阅读 */

话不多说，牛不多吹，切入正题

##### 警告：密集恐惧症可以跳过下列代码展示，直接去文章底部看源码

## 原理及相关功能

1.相关结构体的定义：
```c
int numberOfClasses = 0; //表示课程数量的全局变量

typedef struct Name {
	char name[25]; //学科名称
	int maxScore; //最高分
	double l_score; //学分
	struct Name* next; //下一个学科链表结构
} Name;

typedef struct StudentList { //创建学生信息结构体
	char name[20]; //姓名（最长20个字符，在UTF-8编码下能够保存6个汉字）
	int number; //学号
	int* scores; //成绩数组
	double average; //平均分
	double sum; //总分
	double grade; //绩点
} Student;

typedef struct List { //创建成绩单链表结构
	Student stu;
	struct List* next;
} Node;

Node* head = NULL; //初始化学生信息的链表头部
Node* copy_head_static = NULL; //静态的链表拷贝，后面的一些功能会用到
Name* inform = NULL; //初始化科目信息的链表头部

```

2.自己用c语言实现的一些函数

```c
Node *FreeList(Node *ahead) { //用于清除成绩单占用的内存，防止内存泄漏
	Node *p = ahead;

	while (p != NULL) {
		Node *q = p->next;
		free(p);
		p = q;
	}
	ahead = NULL;
	return ahead;
}

Name *FreeNameList(Name *infor) { //用于清除科目信息占用的内存，重启程序时用到
	Name *p = infor;
	while (p != NULL) {
		Name *q = p->next;
		free(p);
		p = q;
	}
	infor = NULL;
	return infor;
}

Node *Copylist(Node *ahead) { //用于复制原有成绩单，然后将副本进行排序，避免直接对原成绩单进行修改
	if (ahead == NULL) {
		return NULL;
	}
	Node *new_node = (Node *)malloc(sizeof(Node));
	new_node->stu = ahead->stu;
	new_node->next = Copylist(ahead->next);

	return new_node;
}
```
3.设计一个主菜单
```c
void StartMenu() { //打印进入程序时显示的菜单
	system("cls");
	printf("****************************************************************\n");
	printf("*\t欢迎使用学生成绩管理系统\t\t*\n");
	printf("*\t\t请选择功能\t\t\t*\n");
	printf("****************************************************************\n");
	printf("*\t\t1.录入学生信息\t\t\t*\n");
	printf("*\t\t2.打印学生信息\t\t\t*\n");
	printf("*\t\t3.保存学生信息\t\t\t*\n");
	printf("*\t\t4.读取学生信息\t\t\t*\n");
	printf("*\t\t5.查找学生信息\t\t\t*\n");
	printf("*\t\t6.修改学生信息\t\t\t*\n");
	printf("*\t\t7.删除学生信息\t\t\t*\n");
	printf("*\t\t8.启动学生信息工具箱\t\t*\n"); //计算统计类的功能都在这里
	printf("*\t\t9.查看当前科目信息\t\t*\n");
	printf("*\t\tR.清空学生信息\t\t\t*\n");
	printf("*\t\tX.重置课程信息(重新启动程序)\t*\n");
	printf("*\t\tM.管理已保存科目信息\t\t*\n");
	printf("*\t\ti.显示程序功能提示\t\t*\n");
	printf("*\t\t0.退出程序\t\t\t*\n");
	printf("*************************************************\n");

	printf("!.>_<||O_0\t\n"); //浅浅在主菜单卖个萌 $>_<$
}
```
4.保存信息三件套

```c
Name *add_name() { //创建新学科信息的函数
	printf("请输入要统计的学科门数：");
	scanf("%d", &numberOfClasses);
	Name *infor = (Name *)malloc(sizeof(Name));
	Name *p = infor;
	for (int i = 0; i < numberOfClasses; i++) {
		printf("请输入第 %d 门学科的名称：", i + 1);
		scanf("%s", p->name);
		printf("请输入这门课程的最大分数： ");
		scanf("%d", &p->maxScore);
		if (i < numberOfClasses - 1) {
			p->next = (Name *)malloc(sizeof(Name));
			p = p->next; //此处采用了链式存储的形式存储学科信息，故采用链表遍历方法
		}
	}
	p->next = NULL;
	printf("科目信息保存成功！\n");
	return infor;
}

void InputStudent() { //输入学生信息的函数
	Node *NewNode = (Node *)malloc(sizeof(Node)); //创建一个新的学生信息结构
	NewNode->next = NULL;
	Node *p = head;
	printf("输入学生学号：");
	scanf("%d", &NewNode->stu.number);
	printf("输入学生姓名：");
	scanf("%s", NewNode->stu.name);
	int *array = (int *)malloc(sizeof(int) * numberOfClasses);
	NewNode->stu.scores = array;
	Name *q = inform;
	double sum = 0;
	for (int i = 0; i < numberOfClasses; i++) {
		printf("请输入该学生 %s 的成绩： ", q->name);
		scanf("%d", &NewNode->stu.scores[i]);

		if (NewNode->stu.scores[i] > q->maxScore || NewNode->stu.scores[i] < 0) {
			printf("成绩输入无效，请确认成绩处于有效范围内。\n");
			printf("添加学生信息失败\n");
			free(NewNode);
			system("pause");
			return;
		}
		sum += NewNode->stu.scores[i];
		q = q->next;
	}
	double avg = sum * 1.0 / numberOfClasses;
	NewNode->stu.sum = sum;
	NewNode->stu.average = avg;
	while (p != NULL && p->next != NULL) { //此循环用于将学生信息加入链表尾部
		p = p->next;
	}
	if (p == NULL) {
		head = NewNode;
	} else {
		p->next = NewNode;
	}
	printf("学生成绩录入完成！该学生的平均成绩为 %.2lf ,总分为 %.2lf \n", avg, sum);
	system("pause");
	// system("pause") 函数用于暂停程序，便于用户查看输出结果
	system("cls");
}

void SaveInfo() { //保存学生信息到文件中的函数
	system("cls");
	printf("确定要保存吗？此操作会覆盖原有数据（按下y确定，按下其它按键返回）：");
	char ch = getch(); //按键交互，按下对应按键即可实现对应功能
	if (ch != 'y') {
		return;
	}
	char namae_[25] = "";
	printf("目前储存的成绩信息情况如下：\n");
	printf("成绩信息1：");
	FILE *file1 = fopen("studinfo1.txt", "r");
	if (file1 == NULL) { //逐个打印存档信息位的数据
		printf("（空）");
	} else {
		printf("已保存 ");
		fscanf(file1, "%s", namae_);
		printf("%s ", namae_);
	}
	printf("\n");
	printf("成绩信息2：");
	FILE *file2 = fopen("studinfo2.txt", "r");
	if (file2 == NULL) {
		printf("（空）");
	} else {
		printf("已保存 ");
		fscanf(file2, "%s", namae_);
		printf("%s ", namae_);
	}
	printf("\n");
	printf("成绩信息3：");
	FILE *file3 = fopen("studinfo3.txt", "r");
	if (file3 == NULL) {
		printf("（空）");
	} else {
		printf("已保存 ");
		fscanf(file3, "%s", namae_);
		printf("%s ", namae_);
	}
	printf("\n");
	printf("成绩信息4：");
	FILE *file4 = fopen("studinfo4.txt", "r");
	if (file4 == NULL) {
		printf("（空）");
	} else {
		printf("已保存 ");
		fscanf(file4, "%s", namae_);
		printf("%s ", namae_);
	}
	printf("\n");
	printf("成绩信息5：");
	FILE *file5 = fopen("studinfo5.txt", "r");
	if (file5 == NULL) {
		printf("（空）");
	} else {
		printf("已保存");
		fscanf(file5, "%s", namae_);
		printf("%s ", namae_);
	}
	printf("\n");
	printf("成绩信息6：");
	FILE *file6 = fopen("studinfo6.txt", "r");
	if (file6 == NULL) {
		printf("（空）");
	} else {
		printf("已保存");
		fscanf(file6, "%s", namae_);
		printf("%s ", namae_);
	}
	printf("\n");
	printf("成绩信息7：");
	FILE *file7 = fopen("studinfo7.txt", "r");
	if (file7 == NULL) {
		printf("（空）");
	} else {
		printf("已保存");
		fscanf(file7, "%s", namae_);
		printf("%s ", namae_);
	}
	printf("\n");
	printf("\n提示：如果想要储存更多的学生信息，可以将学生信息复制到其它目录并重命名");
	printf("\n请按键选择需要储存成绩的位置：");
	FILE *file; //总文件指针
	char selet = _getch();
	char cach;
	switch (selet) {
		case '1':
			file1 = fopen("studinfo1.txt", "w");
			file = file1;
			break;
		case '2':
			file2 = fopen("studinfo2.txt", "w");
			file = file2;
			break;
		case '3':
			file3 = fopen("studinfo3.txt", "w");
			file = file3;
			break;
		case '4':
			file4 = fopen("studinfo4.txt", "w");
			file = file4;
			break;
		case '5':
			file5 = fopen("studinfo5.txt", "w");
			file = file5;
			break;
		case '6':
			file6 = fopen("studinfo6.txt", "w");
			file = file6;
			break;
		case '7':
			file7 = fopen("studinfo7.txt", "w");
			file = file7;
			break;
		default:
			printf("\n没有该选项！保存失败！\n按任意键回到主菜单。\n");
			cach = _getch();
			return;
			break;
	}
	if (file == NULL) {
		printf("打开文件失败！请检查文件管理权限！");
		system("pause");
		return;
	}
	printf("\n请输入学生信息（班级）名称：");
	char namae[25] = "";
	scanf("%s", namae);
	Node *ent = head; //创建头指针
	fprintf(file, "%s\n", namae);
	fprintf(file, "%d\n", numberOfClasses); //保存学科数量
	while (ent != NULL) { //用于逐一将学生信息写入文件的循环
		fprintf(file, "%d\n", ent->stu.number);
		fputs(ent->stu.name, file);
		fprintf(file, "\n");

		for (int j = 0; j < numberOfClasses; j++) {
			fprintf(file, "%d\n", ent->stu.scores[j]);
		}
		fprintf(file, "%lf\n", ent->stu.average);
		fprintf(file, "%lf\n", ent->stu.sum);
		ent = ent->next;
	}
	fclose(file); //完成后关闭文件
	printf("\n数据保存成功！\n");
	system("pause");
}
```
5.读取信息的函数

```c
void ReadStudents() {  //读取学生信息的函数
	system("cls"); //清屏函数
	printf("确定要打开文件吗？读取操作会覆盖掉程序缓存在内存中的学生信息。\n");
	printf("注意，在读取文件时，请务必确保本次读取的科目数量等于文件中的科目数量。\n");
	printf("按下y确定，按下其它按键返回\n");
	char yes = getch();
	switch (yes) {
		case 'y':
			break;
		default:
			return;
	}
	printf("目前储存的成绩信息情况如下：\n");
	char namae_[25] = "";
	printf("成绩信息1：");
	FILE *file1 = fopen("studinfo1.txt", "r");
	if (file1 == NULL) { //逐个打印存档信息位的数据
		printf("（空）");
	} else {
		printf("已保存 ");
		fscanf(file1, "%s", namae_);
		printf("%s ", namae_);
	}
	printf("\n");
	printf("成绩信息2：");
	FILE *file2 = fopen("studinfo2.txt", "r");
	if (file2 == NULL) {
		printf("（空）");
	} else {
		printf("已保存 ");
		fscanf(file2, "%s", namae_);
		printf("%s ", namae_);
	}
	printf("\n");
	printf("成绩信息3：");
	FILE *file3 = fopen("studinfo3.txt", "r");
	if (file3 == NULL) {
		printf("（空）");
	} else {
		printf("已保存 ");
		fscanf(file3, "%s", namae_);
		printf("%s ", namae_);
	}
	printf("\n");
	printf("成绩信息4：");
	FILE *file4 = fopen("studinfo4.txt", "r");
	if (file4 == NULL) {
		printf("（空）");
	} else {
		printf("已保存 ");
		fscanf(file4, "%s", namae_);
		printf("%s ", namae_);
	}
	printf("\n");
	printf("成绩信息5：");
	FILE *file5 = fopen("studinfo5.txt", "r");
	if (file5 == NULL) {
		printf("（空）");
	} else {
		printf("已保存");
		fscanf(file5, "%s", namae_);
		printf("%s ", namae_);
	}
	printf("\n");
	printf("成绩信息6：");
	FILE *file6 = fopen("studinfo6.txt", "r");
	if (file6 == NULL) {
		printf("（空）");
	} else {
		printf("已保存");
		fscanf(file6, "%s", namae_);
		printf("%s ", namae_);
	}
	printf("\n");
	printf("成绩信息7：");
	FILE *file7 = fopen("studinfo7.txt", "r");
	if (file7 == NULL) {
		printf("（空）");
	} else {
		printf("已保存");
		fscanf(file7, "%s", namae_);
		printf("%s ", namae_);
	}
	printf("\n");
	printf("\n请按键选择需要打开的成绩清单：");
	FILE *file;
	char selet = _getch();
	char cach;
	switch (selet) {
		case '1':
			file1 = fopen("studinfo1.txt", "r");
			file = file1;
			break;
		case '2':
			file2 = fopen("studinfo2.txt", "r");
			file = file2;
			break;
		case '3':
			file3 = fopen("studinfo3.txt", "r");
			file = file3;
			break;
		case '4':
			file4 = fopen("studinfo4.txt", "r");
			file = file4;
			break;
		case '5':
			file5 = fopen("studinfo5.txt", "r");
			file = file5;
			break;
		case '6':
			file6 = fopen("studinfo6.txt", "r");
			file = file6;
			break;
		case '7':
			file7 = fopen("studinfo7.txt", "r");
			file = file7;
			break;
		default:
			printf("\n没有该选项！打开失败！\n按任意键回到主菜单。\n");
			cach = _getch();
			return;
			break;
	}
	if (file == NULL) {
		printf("打开失败！请检查文件是否存在以及是否可读取\n");
		system("pause");
		return;
	}
	system("cls");
	Node *p = (Node *)malloc(sizeof(Node)); //注意，接下来的读取操作会覆盖掉程序缓存在内存中的学生信息
	p->next = NULL;  //
	char str[250];
	char namae[25] = "\0";
	fscanf(file, "%s", namae);
	int _numberOfClass = -1;
	int i = 0;
	fscanf(file, "%d", &_numberOfClass);
	if (_numberOfClass != numberOfClasses) { //比较当前读取信息是否和内存中的学科对应
		printf("读取文件的科目数与当前科目数不一致！读取失败！\n按任意键返回主菜单。\n");
		char cach = _getch();
		return;
	}
	head = p;
	while (fscanf(file, "%s", str) != EOF) {

		if (strcmp(str, "")) {
			switch (i) {
				case 0:
					p->stu.number = atoi(str);
					break;
				case 1:
					strcpy(p->stu.name, str);
					break;
				case 2:
					p->stu.scores = (int *)malloc(sizeof(int) * numberOfClasses);
					for (int j = 0; j < numberOfClasses; j++) {
						p->stu.scores[j] = atoi(str);
						if (j < numberOfClasses - 1) {
							fscanf(file, "%s", str);
						}
					}
					break;
				case 3:
					p->stu.average = atof(str);
					break;
				case 4:
					p->stu.sum = atof(str);
					break;
				default:
					break;
			}
		}
		i++;

		if (i > 4) {
			Node *q = (Node *)malloc(sizeof(Node));
			q->next = NULL;
			p->next = q;
			p = q;
			i = 0;
		}
	}
	Node *temp = head;
	while (temp->next->next != NULL) { //清除链表末尾未初始化的数据
		temp = temp->next;
	}
	free(temp->next);
	temp->next = NULL;
	PrintStudents(head);
	fclose(file);
}
```
5. 成绩统计图的代码实现
   （个人认为这段代码并不是很好，因为重复的代码太多了，原谅我能力不足）

```c
void ScoreGraphSum() { //该功能用来统计学生的成绩区间，并使数据可视化。(相当于横向的直方图）
	system("cls");
	if (head == NULL) {
		printf("还没有录入成绩！按任意键返回工具箱菜单。\n");
		char cache = _getch();
		return;
	}
	Node* p = head;
	printf("该功能用来统计学生的成绩区间，并使数据可视化。\n");
	printf("使用前，请先输入学科和成绩区间的个数并自定义成绩区间的界限。\n");
	printf("注意：成绩区间的个数必须为整数，成绩区间的界限必须由高到低输入。\n");
	printf("请输入要统计的学科：（如果要统计总分，请输入 总分：）");
	char subj[25];
	scanf("%s", subj);
	Name* gg = inform; //学科信息结构体的指针
	
	if (strstr(subj, "总分")) {
		printf("请输入分数区间段的个数：（请输入2-15之间的整数）\n");
		int number;
		scanf("%d", &number);
		if (number < 2 || number > 15) {
			printf("输入错误！请重新输入。（请输入2-15之间的整数）\n");
			scanf("%d", &number);
			if (number < 2 || number > 15) {
				printf("你这个人真是顽固不化。\n");
				char cach = _getch();
				return;
			}
		}
		double* scored = (double*)malloc(sizeof(double) * (number - 1));
		for (int i = 0; i < number - 1; i++) {
			printf("请输入第 %d 个和第 %d 个区间的分界分数：", i + 1, i + 2);
			scanf("%lf", &scored[i]);
		}
		int* people = (int*)malloc(sizeof(int) * (number));
		for (int r = 0; r < number; r++) {
			people[r] = 0;
		}
		while (p != NULL) {
			int j = 0;
			for (j = 0; j < number; j++) {
				if (p->stu.sum >= scored[j]) {
					people[j]++;
					break;
				}
				if (j == number - 1 && p->stu.sum < scored[j]) {
					people[number - 1]++;
					break;
				}
			}
			p = p->next;
		}
		system("cls");
		printf("\033[42m");
		system("color 2F");
		printf("\n*********************************************************************************\n");
		printf("成绩统计图如下：\n\n");
		for (int i = 0; i < number; i++) {
			if (i == 0) {
				printf("满分 到 %.0lf\t\t", scored[i]);
			}
			else if (i > 0 && i < number - 1) {
				printf("%.0lf 到 %.0lf\t\t", scored[i - 1], scored[i]);
			}
			else {
				printf("%.0lf 到 0\t\t", scored[i - 1]);
			}
			for (int xj = 0; xj < people[i]; xj++) {
				printf("**");
			}
			printf("\n");
		}
		printf("\n*********************************************************************************\n\n");
		int peoplesum = 0;
		double* percent = (double*)malloc(sizeof(double) * number);
		for (int dj = 0; dj < number; dj++) {
			peoplesum += people[dj];
		}
		for (int fj = 0; fj < number; fj++) {
			percent[fj] = (people[fj] * 1.0) / peoplesum * 100;
			if (fj == 0) {
				printf("满分 到 %.1lf 分之间的同学占比：%.2lf %%\n", scored[fj], percent[fj]);
			}
			else if (fj > 0 && fj < number - 1) {
				printf("%.1lf 到 %.1lf 分之间的同学占比：%.2lf %%\n", scored[fj - 1], scored[fj], percent[fj]);
			}
			else {
				printf("%.1lf 到 0 分之间的同学占比：%.2lf %%\n\n", scored[fj - 1], percent[fj]);
			}
		}
		printf("\n\n");
		printf("注：如果在对应的分数段内每出现一个人，就会出现两个 * 号（**）\n\n");
		printf("按任意键回到工具箱菜单。\n");
		char cach = _getch();
		return;
	}
	else {
		while (gg != NULL) {
			int jj = 0; // 学科分数的下标
			if (strstr(gg->name, subj)) {
				printf("请输入分数区间段的个数：（请输入2-15之间的整数）\n");
				int number;
				scanf("%d", &number);
				if (number < 2 || number > 15) {
					printf("输入错误！请重新输入。（请输入2-15之间的整数）\n");
					scanf("%d", &number);
					if (number < 2 || number > 15) {
						printf("你这个人真是顽固不化。\n");
						char cach = _getch();
						return;
					}
				}
				int* scored = (int*)malloc(sizeof(int) * (number - 1));
				for (int i = 0; i < number - 1; i++) {
					printf("请输入第 %d 个和第 %d 个区间的分界分数：", i + 1, i + 2);
					scanf("%d", &scored[i]);
				}
				int* people = (int*)malloc(sizeof(int) * (number));
				for (int r = 0; r < number; r++) {
					people[r] = 0;
				}
				while (p != NULL) {
					int j = 0;
					for (j = 0; j < number; j++) {
						if (p->stu.scores[jj] >= scored[j]) {
							people[j]++;
							break;
						}
						if (j == number - 1 && p->stu.scores[jj] < scored[j]) {
							people[number - 1]++;
							break;
						}
					}
					p = p->next;
				}
				system("cls");
				printf("\033[42m");
				system("color 2F");
				printf("\n*********************************************************************************\n\n");
				printf("成绩统计图如下：\n\n");
				for (int i = 0; i < number; i++) {
					if (i == 0) {
						printf("满分 到 %d\t\t", scored[i]);
					}
					else if (i > 0 && i < number - 1) {
						printf("%d 到 %d\t\t", scored[i - 1], scored[i]);
						if (scored[i] < 10) {
							printf("\t");
						}
					}
					else {
						printf("%d 到 0\t\t\t", scored[i - 1]);
					}
					for (int xj = 0; xj < people[i]; xj++) {
						printf("**");
					}
					printf("\n");
				}
				printf("\n\n");
				printf("\n*********************************************************************************\n"); //下面是用来计算区间成绩所占百分比的语句
				int peoplesum = 0;
				double* percent = (double*)malloc(sizeof(double)*number);
				for (int dj = 0; dj < number; dj++) {
					peoplesum += people[dj];
				}
				for (int fj = 0; fj < number; fj++) {
					percent[fj] = (people[fj] * 1.0) / peoplesum * 100;
					if (fj == 0) {
						printf("满分 到 %d 分之间的同学占比：%.2lf %%\n", scored[fj], percent[fj]);
					}
					else if (fj > 0 && fj < number - 1) {
						printf("%d 到 %d 分之间的同学占比：%.2lf %%\n", scored[fj - 1], scored[fj], percent[fj]);
					}
					else {
						printf("%d 到 0 分之间的同学占比：%.2lf %%\n\n", scored[fj - 1], percent[fj]);
					}
				}
				printf("注：如果在对应的分数段内每出现一个人，就会出现两个 * 号（**）\n\n");
				printf("按任意键回到工具箱菜单。\n");
				char cach = _getch();
				return;
			}
			jj++; //如果和输入学科不匹配，自动让下标加1访问后面的学科分数
			gg = gg->next;
		}
	}
	if (gg == NULL) {
		printf("未找到该学科！\n");
		printf("按下任意键回到工具箱菜单。\n");
		char cache = _getch();
		return;
	}
}
```
6.删除信息的函数参考

```c
void DeleteStudentInform() {
	printf("该功能用于删除已经保存在磁盘中的学生信息文件。\n");
	printf("确定要进行删除操作吗？确定请按y,否则按其他键返回。\n");
	char get_ = _getch();
	if (get_ != 'y') {
		return;
	}
	system("cls");
	printf("目前储存的成绩信息情况如下：\n");
	char namae_[25] = "";
	char nfile1[] = "studinfo1.txt";
	char nfile2[] = "studinfo2.txt";
	char nfile3[] = "studinfo3.txt";
	char nfile4[] = "studinfo4.txt";
	char nfile5[] = "studinfo5.txt";
	char nfile6[] = "studinfo6.txt";
	char nfile7[] = "studinfo7.txt";
	printf("成绩信息1：");
	FILE* file1 = fopen("studinfo1.txt", "r");
	if (file1 == NULL) { //逐个打印存档信息位的数据
		printf("（空）");
	}
	else {
		printf("已保存 ");
		fscanf(file1, "%s", namae_);
		printf("%s ", namae_);
	}
	printf("\n");
	printf("成绩信息2：");
	FILE* file2 = fopen("studinfo2.txt", "r");
	if (file2 == NULL) {
		printf("（空）");
	}
	else {
		printf("已保存 ");
		fscanf(file2, "%s", namae_);
		printf("%s ", namae_);
	}
	printf("\n");
	printf("成绩信息3：");
	FILE* file3 = fopen("studinfo3.txt", "r");
	if (file3 == NULL) {
		printf("（空）");
	}
	else {
		printf("已保存 ");
		fscanf(file3, "%s", namae_);
		printf("%s ", namae_);
	}
	printf("\n");
	printf("成绩信息4：");
	FILE* file4 = fopen("studinfo4.txt", "r");
	if (file4 == NULL) {
		printf("（空）");
	}
	else {
		printf("已保存 ");
		fscanf(file4, "%s", namae_);
		printf("%s ", namae_);
	}
	printf("\n");
	printf("成绩信息5：");
	FILE* file5 = fopen("studinfo5.txt", "r");
	if (file5 == NULL) {
		printf("（空）");
	}
	else {
		printf("已保存 ");
		fscanf(file5, "%s", namae_);
		printf("%s ", namae_);
	}
	printf("\n");
	printf("成绩信息6：");
	FILE* file6 = fopen("studinfo6.txt", "r");
	if (file6 == NULL) {
		printf("（空）");
	}
	else {
		printf("已保存 ");
		fscanf(file6, "%s", namae_);
		printf("%s ", namae_);
	}
	printf("\n");
	printf("成绩信息7：");
	FILE* file7 = fopen("studinfo7.txt", "r");
	if (file7 == NULL) {
		printf("（空）");
	}
	else {
		printf("已保存 ");
		fscanf(file7, "%s", namae_);
		printf("%s ", namae_);
	}
	printf("\n");
	printf("请选择需要删除的学生信息存档：\n");
	char ggc = _getch();
	char hhc;
	char* nfile;
	switch (ggc) {
	case '1':
		nfile = nfile1;
		fclose(file1);
		break;
	case '2':
		nfile = nfile2;
		fclose(file2);
		break;
	case '3':
		nfile = nfile3;
		fclose(file3);
		break;
	case '4':
		nfile = nfile4;
		fclose(file4);
		break;
	case '5':
		nfile = nfile5;
		fclose(file5);
		break;
	case '6':
		nfile = nfile6;
		fclose(file6);
		break;
	case '7':
		nfile = nfile7;
		fclose(file7);
		break;
	default:
		printf("没有该选项！删除失败！\n");
		printf("按下任意键返回工具箱菜单。\n");
		hhc = _getch();
		return;
	}
	printf("\n确认删除该存档吗？确认请按y,否则按其他键返回。\n");
	char cac = _getch();
	if (cac != 'y') {
		return;
	}
	int state = remove(nfile);
	if (state == 0) {
		printf("文件删除成功！\n");
	}
	else {
		printf("很抱歉，文件删除失败。错误码：%d\n", state);
	}
	printf("按下任意键返回工具箱。\n");
	char cache = _getch();
	return;
}
```

6.主要用到的头文件等

```c
#define _CRT_SECURE_NO_WARNINGS 1 //Visual Studio的尿性不必多说
#include <stdio.h>
#include <string.h> //处理字符串用的
#include <stdlib.h> //内存分配要用到的
#include <windows.h> //便于控制台的不同样式的输出
#include <time.h> //给彩蛋用的时间统计头文件
#include <conio.h> // <conio.h> 是点按交互需要用到的头文件

#include "games.h" //彩蛋头文件

void usleep(__int64 usec) { //网上抄来的适用于windows平台的时间暂停代码
	HANDLE timer;
	LARGE_INTEGER interval;
	interval.QuadPart = -10 * usec;
	timer = CreateWaitableTimer(NULL, TRUE, NULL);
	SetWaitableTimer(timer, &interval, 0, NULL, NULL, 0);
	WaitForSingleObject(timer, INFINITE);
	CloseHandle(timer);
}
```

## 源代码

已经上传到了gitee托管，后续会考虑上传到github托管。[点击查看](https://gitee.com/katayo-kizuna/course-design-for-c-language/tree/master/%E5%AD%A6%E7%94%9F%E6%88%90%E7%BB%A9%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%EF%BC%88%E5%8D%9A%E5%AE%A2%E7%89%88%EF%BC%89)

##### 本程序已经基本完成。有什么建议可以在下面吐槽~

#### ---未完待续---