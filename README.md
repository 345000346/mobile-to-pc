# 手机网页转PC网页 (Mobile to PC Redirector)

[![Tampermonkey](https://img.shields.io/badge/Tampermonkey-兼容-green)](https://www.tampermonkey.net/)
[![Greasy Fork](https://img.shields.io/badge/Greasy%20Fork-安装-blue)](https://greasyfork.org/zh-CN/scripts/389749)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

这是一个为桌面浏览器设计的用户脚本（User Script），会将多个主流网站的手机版（M站）与常见中间页链接自动重定向到对应的 PC 版页面，减少在桌面端打开移动站的不便。

## 核心功能

- **自动重定向**：命中规则后立即 `location.replace` 跳转，不污染浏览器历史。
- **移动设备豁免**：优先使用 Client Hints（`userAgentData.mobile`），并回退 UA 检测；在手机/平板上不跳转。
- **规则策略**：以路径白名单为主（商品、帖子、视频等）；部分站点（NGA、萌百、Facebook 等）做整站换域。
- **电商参数保留**：淘宝/天猫跳转时保留 `skuId` 等有用参数。
- **防循环**：同一会话内短时间重复跳转同一源地址时中止，避免错误规则导致死循环。
- **易于扩展**：规则为 `URL => 新地址 | null` 的函数列表，方便追加。

## 支持的网站

| 站点 | 覆盖范围 |
|------|----------|
| 京东 | 商品详情（`item.m` / `mitem` / `wqitem` / 医药 / 香港站）、店铺首页、推广中间页 `re.jd.com` |
| 淘宝 / 天猫 | 商品详情；支持 `h5.m`、`m.intl`；保留 `skuId` |
| 哔哩哔哩 | 视频（含 `p`/`t`）、番剧 `ep`/`ss`、搜索路径 `/s/` 规范化 |
| 新浪微博 | 状态页 `/status` `/detail`、用户页 `/u` `/profile` |
| 知乎 | 问题/回答、文章（跳转专栏域名） |
| 豆瓣 | 电影 / 图书 / 音乐 subject 页 |
| 什么值得买 | 内容页 `/p/{id}/` |
| 百度贴吧 | `jump2.bdimg.com` 中间页 → 帖子 PC 页 |
| 虎扑 | `m.hupu.com/bbs`、`/zone` |
| NGA | 整站换域：`ngabbs.com` / `nga.178.com` / `yues.org` → `bbs.nga.cn` |
| 萌娘百科 | 整站换域：`mzh.moegirl.org.cn` → `zh.moegirl.org.cn` |
| Bangumi | `/m` 移动入口 → `bgm.tv/rakuen` |
| 维基百科及姐妹项目 | Wikipedia / Wiktionary / Wikibooks 等 `*.m.*`，以及 Wikidata、MediaWiki.org |
| Facebook | `m.facebook.com` |
| X / Twitter | `mobile.twitter.com` → `x.com` |
| Amazon | 常见站点 `gp/aw` 移动商品页 |
| AliExpress | 商品 / 店铺路径 |
| WikiHow | 移动文章页 |
| 掘金 | 文章页 |
| CSDN | 博客文章页 |

## 安装指南

### 方式一：Greasy Fork（推荐）

1. 安装 [Tampermonkey](https://www.tampermonkey.net/)（Chrome / Edge / Firefox 等）。
2. 打开脚本主页并安装：  
   **[https://greasyfork.org/zh-CN/scripts/389749](https://greasyfork.org/zh-CN/scripts/389749)**
3. 之后可通过脚本管理器自动检查更新（`@updateURL` 指向 Greasy Fork）。

### 方式二：从本仓库安装

1. 安装 Tampermonkey。
2. 打开仓库中的 [`mobile-to-pc.js`](./mobile-to-pc.js)，复制全部内容。
3. 在 Tampermonkey 中「添加新脚本」，粘贴后保存。

也可使用 raw 链接（需管理器支持从 URL 安装）：

```text
https://raw.githubusercontent.com/345000346/mobile-to-pc/main/mobile-to-pc.js
```

## 使用方法

安装后脚本在后台运行。在桌面浏览器打开受支持站点的移动版链接时，会无缝跳到 PC 版。

## 规则失效时

请在仓库提交 [Issue](https://github.com/345000346/mobile-to-pc/issues)，尽量包含：

1. 完整的移动版 URL  
2. 期望的 PC 版 URL  
3. 浏览器与脚本版本  

也欢迎直接发 Pull Request 修改规则。

## 相关链接

- Greasy Fork：https://greasyfork.org/zh-CN/scripts/389749  
- 许可证：[MIT](./LICENSE)
