# 手机网页转PC网页 (Mobile to PC Redirector)

[![Tampermonkey](https://img.shields.io/badge/Tampermonkey-兼容-green)](https://www.tampermonkey.net/)
[![Greasy Fork](https://img.shields.io/Greasy%20Fork-安装-blue)](https://greasyfork.org/zh-CN/scripts/389749)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Version](https://img.shields.io/badge/version-2.2-blue)](./CHANGELOG.md)

桌面浏览器用户脚本：把常见站点的手机版（M 站）与中间页自动 `location.replace` 到对应 PC 版页面。

## 行为

- 命中规则后立即跳转，不污染历史记录
- 通过 UA 识别移动设备，手机/平板上不跳转
- **按 hostname 分发**：`BY_HOST[host](url)`，站内再用 path 规则改写；维基 `*.m.*` 走独立 fallback
- 路径白名单为主；少数站点（NGA、萌百、Facebook 等）整站换域
- 保留关键参数：淘宝/天猫 `skuId`、B 站 `p`/`t`
- IT之家按文章 ID 拆分重写路径（`/html/{ID}.htm` → `/0/{前3位}/{剩余}.htm`）

## 支持的网站

### 电商

| 站点 | 覆盖范围 |
|------|----------|
| 京东 | 商品详情（`item.m` / `mitem` / `wqitem` / 医药 / 香港站）、店铺首页、推广中间页 `re.jd.com` |
| 淘宝 / 天猫 | 商品详情；支持 `h5.m`、`m.intl`；保留 `skuId` |
| Amazon | 常见站点 `gp/aw` 移动商品页 |
| AliExpress | 商品 / 店铺路径 |

### 社交

| 站点 | 覆盖范围 |
|------|----------|
| 新浪微博 | 状态页 `/status` `/detail`、用户页 `/u` `/profile` |
| 知乎 | 问题/回答、文章（跳转专栏域名） |
| Facebook | `m.facebook.com` |
| X / Twitter | `mobile.twitter.com` → `x.com` |

### 论坛 / 社区

| 站点 | 覆盖范围 |
|------|----------|
| 百度贴吧 | `jump2.bdimg.com` 中间页 → 帖子 PC 页 |
| 虎扑 | `m.hupu.com/bbs`、`/zone` |
| NGA | 整站换域：`ngabbs.com` / `nga.178.com` → `bbs.nga.cn` |
| 萌娘百科 | 整站换域：`mzh.moegirl.org.cn` → `zh.moegirl.org.cn` |
| Bangumi | `/m` 移动入口 → `bgm.tv/rakuen` |

### 新闻 / 资讯

| 站点 | 覆盖范围 |
|------|----------|
| 虎嗅网 | `m.huxiu.com` 整站换域 |
| 澎湃新闻 | `m.thepaper.cn` 整站换域 |
| IT之家 | `m.ithome.com/html/{ID}.htm` → PC 文章页（ID 拆分重写） |
| 今日头条 | `m.toutiao.com` 整站换域 |
| 搜狐新闻 | `m.sohu.com` 整站换域 |
| 36氪 | `m.36kr.com` 整站换域 |
| 网易新闻 | `m.163.com` / `3g.163.com` 的 `/dy/article/{ID}.html` 文章页 |
| 腾讯新闻 | `view.inews.qq.com/a/{ID}` 中间页 → `news.qq.com/rain/a/{ID}` |

### 内容 / 博客

| 站点 | 覆盖范围 |
|------|----------|
| 哔哩哔哩 | 视频（含 `p`/`t`）、番剧 `ep`/`ss` |
| 豆瓣 | 电影 / 图书 / 音乐 subject 页 |
| 什么值得买 | 内容页 `/p/{id}/` |
| WikiHow | 移动文章页 |
| 掘金 | 文章页 |
| CSDN | 博客文章页 |

### 百科 / 知识库

| 站点 | 覆盖范围 |
|------|----------|
| 维基百科及姐妹项目 | Wikipedia / Wiktionary / Wikibooks 等 `*.m.*`，以及 Wikidata、MediaWiki.org |

## 安装

### Greasy Fork（推荐）

1. 安装 [Tampermonkey](https://www.tampermonkey.net/)
2. 打开 [脚本主页](https://greasyfork.org/zh-CN/scripts/389749) 安装
3. 之后由管理器按 `@updateURL` 自动更新

### 从本仓库

1. 安装 Tampermonkey
2. 复制 [`mobile-to-pc.js`](./mobile-to-pc.js) 全文，在管理器中新建脚本并保存

或使用 raw 链接安装：

```text
https://raw.githubusercontent.com/345000346/mobile-to-pc/main/mobile-to-pc.js
```

## 规则失效时

请开 [Issue](https://github.com/345000346/mobile-to-pc/issues)，尽量包含：

1. 完整的移动版 URL
2. 期望的 PC 版 URL
3. 浏览器与脚本版本

也欢迎直接发 Pull Request。

## 更新日志

详见 [CHANGELOG.md](./CHANGELOG.md)。

## 链接

- Greasy Fork：https://greasyfork.org/zh-CN/scripts/389749
- 更新日志：[CHANGELOG.md](./CHANGELOG.md)
- 许可证：[MIT](./LICENSE)
