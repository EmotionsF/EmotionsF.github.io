---
title: 服务器端口转发
tags:
    - 使用教程
date: 2024-08-09 00:30:00
categories: knowledge
---
通过iptable配置端口转发的方式实现hysteria2代理端口，可以用来应对运营商QoS限速问题（转载自Geek博客）

<!-- more -->

原文链接：https://igeekbb.com/2023/09/22/Hysteria2Port/

## UDP限速

三大运营商对 UDP 的阻断&限速肯定是存在的，至少有 QoS 限制，刚开始还以为南方联通比较宽容，没想都是一丘之貉，我遇见的是阻断，具体表现为“连续下载或跑大流量3分钟左右，就直接阻断，大概再过几分钟又恢复连接“，这些限制一般只是单个端口。本篇博文就来说说如何设置 Hysteria2 端口跳跃，以对抗运营商的阻断和限速。

## 搭建 Hysteria 2

出于话题敏感性，本文不提供搭建方法，可自行在互联网上查找方法。

## 配合 Iptables 实现端口跳跃

按照 Hysteria 官网的说法，Hysteria 服务端并不能同时监听多个端口，因此不能在服务器端使用上面的格式作为监听地址。**建议配合 iptables 的 DNAT 将端口转发到服务器的监听端口。**
[文章出处（官网链接）](https://v2.hysteria.network/zh/docs/advanced/Port-Hopping/)

## 第一步：安装 iptables-persistent

```bash
apt install iptables-persistent
```

一直 YES&ENTER 即可 
![安装](/images/install.webp)

## IPV4 设置

### 清空默认规则、自定义规则

```bash
iptables -F
```

```bash
iptables -X
```

允许本地访问

```bash
iptables -A INPUT -i lo -j ACCEPT
```

开放SSH端口
```bash
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
```
开放 http/https 端口
```bash
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
```
```bash
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
```
开放 UDP 端口（5353 替换为自己 Hysteria 的监听端口）
```bash
iptables -A INPUT -p udp --dport 5353 -j ACCEPT
```
开放 UDP 端口跳跃范围（端口范围为 20000-50000）
```bash
iptables -A INPUT -p udp --dport 20000:50000 -j ACCEPT
```
允许接受本机请求之后的返回数据
```bash
iptables -A INPUT -m state --state RELATED,ESTABLISHED -j ACCEPT
```
其它入站一律禁止
```bash
iptables -P INPUT DROP
```
允许所有出站
```bash
iptables -P OUTPUT ACCEPT
```
查看开放的端口
```bash
iptables -L
```

### 添加 NAT 规则

将匹配到的 UDP 数据包的目标端口在 20000 到 50000 之间的数据包，重定向到本地服务器的 5353 端口

```bash
iptables -t nat -A PREROUTING -p udp --dport 20000:50000 -j DNAT --to-destination :5353
```
查看NAT规则
```bash
iptables -t nat -nL --line
```
![示例](/images/console.webp)

## IPV6 设置

IPV6 设置只需要把上面的`iptables`替换为`ip6tables`即可，其它的操作都是一样的。

## 删除 iptables 规则

> 如果你填写错误，可以使用以下的方法删除iptable规则

删除指定的NAT规则
```bash
iptables -t nat -D PREROUTING <行号>
```
删除所有iptable规则
```bash
iptables -t nat -F
```

对于ipv6的iptable规则，删除方法如下：

```bash
# 删除所有规则 
sudo ip6tables -F 

# 删除 INPUT 链中的所有规则 
sudo ip6tables -F INPUT 

# 删除 INPUT 链中的第一个规则 
sudo ip6tables -D INPUT 1 

# 禁用 INPUT 链中的第一个规则 
sudo ip6tables -I INPUT 1 -j DROP
```

## 卸载 iptables

> 以下是 iptables 的卸载步骤

停止iptables服务

```bash
sudo systemctl stop iptables
```

禁用iptables服务

```bash
sudo systemctl disable iptables
```

> 对于 Debian&Ubuntu 系统

卸载 iptables 软件包

```bash
sudo apt-get remove iptables
```

删除 iptables 配置文件&规则

```bash
sudo apt-get purge iptables
```

> 对于 CentOS 系统

卸载 iptables 软件包

```bash
sudo yum remove iptables
```

删除 iptables 配置文件&规则

```bash
sudo rm -r /etc/iptables/
```


> **许可协议**
> 
>本文采用 [署名-非商业性使用-相同方式共享 4.0 国际](https://creativecommons.org/licenses/by-nc-sa/4.0/) 许可协议，转载请注明出处。

