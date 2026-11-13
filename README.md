# 手机网页转PC网页 (Mobile to PC Redirector)

[![Tampermonkey](https://img.shields.io/badge/Tampermonkey-兼容-green)](https://www.tampermonkey.net/)
[![Greasy Fork](https://img.shields.io/Greasy%20Fork-安装-blue)](https://greasyfork.org/zh-CN/scripts/389749)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Version](https://img.shields.io/badge/version-2.3-blue)](./CHANGELOG.md)

桌面浏览器用户脚本：把常见站点的手机版（M 站）与中间页自动 `location.replace` 到对应 PC 版页面。

## 行为

- 命中规则后立即跳转，不污染历史记录
- 通过 UA 识别移动设备，移动 UA 不跳转；iPadOS 桌面 UA 通过 `maxTouchPoints` 识别
- **按 hostname 分发**：`BY_HOST[host](url)`，站内再用 path 规则改写
- 路径规则为主；部分站点整站换域
- 保留关键参数：淘宝/天猫 `skuId`、B 站 `p`/`t`
- IT之家按文章 ID 拆分重写路径（`/html/{ID}.htm` → `/0/{前3位}/{剩余}.htm`）
- 已由站点服务器 301/302 接管的移动域不再保留规则

## 支持的网站

以下仅列脚本仍实际处理的站点。

### 电商

| 站点 | 覆盖范围 |
|------|----------|
| 京东 | 商品详情 `item.m.jd.com`、店铺首页 `shop.m.jd.com` |
| 淘宝 / 天猫 | 商品详情；`h5.m`、`detail.m.tmall`、`m.tmall`、`m.intl`；保留 `skuId` |
| Amazon | 常见站点 `gp/aw` 移动商品页 |
| AliExpress | 商品 / 店铺路径 |

### 社交

| 站点 | 覆盖范围 |
|------|----------|
| 新浪微博 | 状态页 `/status` `/detail`、用户页 `/u` `/profile` |

### 论坛 / 社区

| 站点 | 覆盖范围 |
|------|----------|
| 百度贴吧 | `jump2.bdimg.com` 中间页 → 帖子 PC 页，保留 `pn` / `see_lz` |
| 虎扑 | `m.hupu.com/bbs`、`/zone`（专区映射到 `bbs.hupu.com/{id}`） |
| NGA | `ngabbs.com` → `bbs.nga.cn` |
| 萌娘百科 | `mzh.moegirl.org.cn` → `zh.moegirl.org.cn` |
| Bangumi | `/m`、`/m/` → `bgm.tv/rakuen`；`/m/topic/**` 按 PC 路径重排；其余 `/m/**` 去前缀 |

### 新闻 / 资讯

| 站点 | 覆盖范围 |
|------|----------|
| 虎嗅网 | `m.huxiu.com` 整站换域 |
| 澎湃新闻 | `m.thepaper.cn` 整站换域 |
| IT之家 | `m.ithome.com/html/{ID}.htm` → PC 文章页（ID 拆分重写） |
| 搜狐新闻 | `m.sohu.com` 整站换域 |
| 网易新闻 | `m.163.com/dy/article/{ID}.html` 文章页 |
| 腾讯新闻 | `view.inews.qq.com/a/{ID}` 中间页 → `news.qq.com/rain/a/{ID}` |

### 内容 / 博客

| 站点 | 覆盖范围 |
|------|----------|
| 哔哩哔哩 | 仅兼容旧 `www.bilibili.com/mobile/video/*` 路径；`m.bilibili.com` 由站点自行跳转 |
| 豆瓣 | 电影 / 图书 / 音乐 subject 页 |
| 什么值得买 | 数字 ID 好价 → `www.smzdm.com`；字母 ID 原创 → `post.smzdm.com` |

## 站点自行跳转 / 已移除

以下移动域已由站点服务器 301/302 接管，脚本不再保留规则（`3g.163.com` 和 `m.yiyaojd.com` 会先转到另一个已处理的移动域）：

- 知乎 `m.zhihu.com`
- Facebook `m.facebook.com`
- X / Twitter `mobile.twitter.com`
- 今日头条 `m.toutiao.com`
- 36氪 `m.36kr.com`
- 网易 `3g.163.com`（301 至 `m.163.com`）
- WikiHow `m.wikihow.com`
- CSDN `m.blog.csdn.net`
- 维基百科及姐妹项目 `*.m.*`、Wikidata、MediaWiki.org
- 哔哩哔哩 `m.bilibili.com`
- NGA `nga.178.com`
- 京东医药 `m.yiyaojd.com`（302 至 `item.m.jd.com`）、推广 `re.jd.com`
- 什么值得买 `post.m.smzdm.com`

以下入口已失效，脚本已删除：

- `m.jd.hk`：入口废弃，商品页 404
- `mitem.jd.com` / `wqitem.jd.com`：真实商品页被导到错误页
- `m.juejin.cn`：域名不存在
- `mzh.moegirl.org.cn.cc`：域名不存在

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

## 测试

规则由 [`test/mobile-to-pc.test.js`](./test/mobile-to-pc.test.js) 表驱动覆盖，包含 `@match` 与 `BY_HOST` 一致性、版本一致性、移动 UA / iPadOS 桌面 UA 判断：

```bash
node --test
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
