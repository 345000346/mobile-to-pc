# Changelog
## [2.4] - 2026-11-15

### 变更

- 京东店铺：`shop/home/{id}` 收紧为纯数字 ID（`[\w-]+` → `\d+`），移除只会产出无效 `mall.jd.com/index-{字母}.html` 的字母分支
- 删除 `biliVideo` 规则中不可达的 `(?:mobile\/)?` 可选前缀（`@match` 仅覆盖 `/mobile/video/*`）

### 文档

- README 补充查询串保留约定（按站点说明保留全部 / 仅关键参数 / 丢弃）

### 清理

- 删除残留 `.gitignore`（仅忽略 `.env`，项目无运行时/环境变量）

### 测试

- 新增“非数字京东店铺路径不跳转”回归测试


本项目所有显著变更均记录于此文件。格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/)。

## [2.3] - 2026-11-13

### 修复

- 什么值得买：数字 ID 好价 → `www.smzdm.com`，字母 ID 原创 → `post.smzdm.com`（此前字母 ID 漏跳，停留在 404 手机页）
- 虎扑：`/zone/{id}` → `bbs.hupu.com/{id}`（此前错误保留 `/zone/`，目标 404）
- Bangumi：`/m/topic/{group|subject|ep|prsn|crt}/{id}` 按 PC 路径重排；其余 `/m/**` 去前缀映射到同路径 PC 页；仅 `/m`、`/m/` 去 `rakuen`，并补充 `/m` 精确入口的 `@match`
- 百度贴吧：保留 `pn` / `see_lz` 等查询参数
- iPadOS 13+ 桌面 UA 通过 `maxTouchPoints` 识别，避免误跳

### 清理

- 删除 20 个已失效/冗余 host 规则：`m.bilibili`、`m.zhihu`、`m.blog.csdn`、`m.wikihow`、`m.facebook`、`m.mediawiki`、`m.wikidata`、`nga.178`、`3g.163`、`mobile.twitter`、`m.toutiao`、`m.yiyaojd`、`post.m.smzdm`、`m.juejin`、`mzh.moegirl.org.cn.cc`、`m.jd.hk`、`mitem`、`wqitem`、`m.36kr`、`re.jd`
- 删除 8 条维基 `*.m.*` `@match` 与 `wikiMobile` fallback；站点服务器已 301 到 PC
- 删除随之无用的 `jdAltProduct`

### 新增

- `test/mobile-to-pc.test.js`：URL → 期望 URL 表、`@match`/`BY_HOST` 一致性、版本一致性、UA 边界
- README 测试小节

### 变更

- README 拆分“脚本规则”和“站点自行跳转/已移除”，删除已失效入口的支持声明
- `@description` 同步实际支持面

## [2.2] - 2026-07-29

### 新增

- 新增 8 个站点，覆盖新闻资讯类高频移动链接：
  - **虎嗅网**：`m.huxiu.com` → `www.huxiu.com`
  - **澎湃新闻**：`m.thepaper.cn` → `www.thepaper.cn`
  - **IT之家**：`m.ithome.com/html/{ID}.htm` → `www.ithome.com/0/{前3位}/{剩余}.htm`（ID 拆分重写）
  - **今日头条**：`m.toutiao.com` → `www.toutiao.com`
  - **搜狐新闻**：`m.sohu.com` → `www.sohu.com`
  - **36氪**：`m.36kr.com` → `www.36kr.com`
  - **网易新闻**：`m.163.com`/`3g.163.com` 的 `/dy/article/{ID}.html` 文章页（`3g.163.com` 会 301 重定向至 `m.163.com`，两者均适配）
  - **腾讯新闻**：`view.inews.qq.com/a/{ID}` → `news.qq.com/rain/a/{ID}`（中间页换域 + 路径改写）

### 变更

- 更新 `@description` 以反映新增站点
- README 支持网站表新增对应条目

## [2.1] - 2026-07-29

### 修复

- 修复淘宝国际站（`m.intl.taobao.com`）商品页规则

### 变更

- 清理失效规则，提升整体准确率

## [2.0] - 2026-07-15

### 变更

- 重构为 **host 表分发架构**：`BY_HOST[host](url)` 统一入口，站内规则与 host 解耦
- 站内规则改为纯函数组合子（`keep` / `rewrite` / `first`），提升可扩展性

## [1.9] - 2026-07-15

### 新增

- 重构跳转引擎为 URL 规则函数
- 扩展更多站点与元数据完善

## [1.8] - 2026-03-07

### 变更

- 回退至稳定基线并提升版本号

## [1.7] - 2026-03-04

### 变更

- 同步文档与脚本描述

## [1.6] - 2026-03-04

### 新增

- 新增 **维基百科**及姐妹项目重定向（`*.m.*` 子域）
- 补强 B 站视频参数保留（`p`/`t`）与番剧场景（`ep`/`ss`）

### 变更

- 降低误跳率

## [1.5] - 2026-02-14

### 变更

- 优化知乎映射与重定向主流程
- 重构 URL 规则为分组模块，保留统一匹配流程

### 新增

- 补充手工测试清单（1.8 回滚时删除）

> 注：1.4 未单独发布，版本序列从 1.3 直接进入 1.5。

## [1.3] - 2025-07-19 → 2026-02-14

### 新增

- 新增 **什么值得买**（`m.smzdm.com`）内容页重定向
- 新增京东推广中间页 `re.jd.com` 转换

### 变更

- 收紧微博、豆瓣重定向规则，降低误跳
- 优化 URL 转换规则，提升稳定性和兼容性

## [1.2] - 2025-05-29

### 变更

- 简化天猫和淘宝 URL 转换逻辑

## [1.1] - 2025-02-27

### 变更

- 优化知乎问题转换逻辑，保留子路径

## [1.0] - 2025-02-19

### 变更

- 优化主逻辑并添加错误处理

## [0.9] - 2025-02-19

### 变更

- 版本号更新

## [0.8] - 2025-01-02

### 新增

- 添加通用工具函数以增强 URL 处理能力

### 变更

- 优化主逻辑

## [0.7] - 2025-01-02

### 新增

- 初始版本
- 支持 **新浪微博**（状态页、用户页）
- 支持 **知乎**（问题/回答、文章）
- 支持 **豆瓣**（电影/图书/音乐 subject 页）
- 支持 **京东**、**淘宝/天猫**、**B站**、**贴吧**、**虎扑**、**NGA**、**萌百**、**Facebook**、**X/Twitter** 等站点
