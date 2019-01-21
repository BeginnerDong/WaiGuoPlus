# 歪果Plus项目开发文档

### 目录

- 功能概述
- 数据对照表


---

**1\. 功能概述**

&emsp;&emsp;项目主要功能包括：一个面向留学生的信息交流平台，主要包含问答解惑、生活动态分享、匿名吐槽、视频分享等四个模块，实现用户相互评价、点赞、收藏等交互功能。

---
**2\. 数据对照表**

通用字段说明

| 字段 | 类型 | 说明 |
| ------    | ------  | ------ | 
| id | int(11)| 主键：该数据ID|
| listorder | int(11) |自定义排序 |
| create_time | int(11) |创建时间 |
| update_time | int(11) |更新时间 |
| delete_time | bigint(13) |删除时间 |
| thirdapp_id | int(11) |关联thirdapp |
| user_no | varchar(255) |关联创建人user_no|
| status | tinyint(2) |状态:1正常；-1删除 |



user表

| 字段 | 类型 | 说明 |
| ------    | ------  | ------ | 
| nickname | varchar(255) | 微信昵称 |
| openid | varchar(255)| 微信openid |
| headImgUrl | varchar(9999) |  微信头像 |
| primary_scope| int(255) | 权限级别：90平台管理员;60超级管理员;30管理员;10用户 |
| user_type| itinyint(10) | 0,小程序用户;2,cms用户; |
| user_no| varchar(255)|用户编号|


userInfo表

| 字段 | 类型 | 说明 |
| ------    | ------  | ------ | 
| gender | tinyint(2) | 性别:1.男;2.女 |
| behavior | tinyint(2)| 区域:1.国内;2.国外 |
| level | varchar(30) |  所在国家名称 |
| address | varchar(255) | 所在城市名称 |
| phone | varchar(255) | 电话 |
| language | varchar(255) | 语言 |
| passage1 | text | 个性签名 |
| passage_array | text | 生日 |
| user_no | varchar(255) | 关联user表 |


label表

| 字段 | 类型 | 说明 |
| ------    | ------  | ------  | 
| title | varchar(40) | 菜单名称 |
| description| varchar(255) | 描述 |
| parentid| int(11) | 父级菜单ID |
| type | tinyint(2) |  1,menu;2,menu_item; |



article表

| 字段 | 类型 | 说明 |
| ------    |  :------:  | ------  | 
| title | varchar(100) | 文章标题 |
| menu_id | int(11) | 关联label表 |
| description | varchar((255) | 描述 |
| content | text | 文章内容 |
| mainImg | varchar(9999) | 文章主图，一般在列表渲染 |



message表

| 字段 | 类型 | 说明 |
| ------    |  :------:  | ------  | 
| title | varchar(255) | 标题 |
| description | varchar((255) | 描述 |
| keywords | varchar((255) | 国家 |
| content | text | 问题内容 |
| mainImg | varchar(999) | 主图，一般在列表渲染 |
| bannerImg | varchar(9999) | 轮播图，一般在详情渲染 |
| video | varchar(999) | 视频 |
| type | int(11) | 类别:1.问题;2.动态;3.吐槽;4.视频;5.回答;6.评论;7.通知,8.意见反馈 |
| view_count | int(11) | 浏览量 |
| reply_id | int(11) | 回复的其他人的message |
| relation_id | int(11) | 关联message |
| relation_user | int(11) | 关联通知接收人user |



log表

| 字段 | 类型 | 说明 |
| ------    |  :------:  | ------  | 
| type | int(11) | 类别:4.点赞;5.关注; |
| order_no | varchar(100) | 关联message |
| pay_no | varchar(255) | 关联user |
---