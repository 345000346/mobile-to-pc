# 手机网页转PC网页 (Mobile to PC Redirector)

[![Tampermonkey](https://img.shields.io/badge/Tampermonkey-兼容-green)](https://www.tampermonkey.net/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

这是一个为桌面浏览器设计的用户脚本（User Script），旨在将多个主流网站的手机版（M站）网页自动重定向到其对应的PC版网页，以提供更佳的浏览体验。

## 核心功能

- **自动重定向**：无需任何手动操作，访问移动版页面时自动跳转。
- **广泛的网站支持**：覆盖多个常用中文与国际网站。
- **移动设备豁免**：脚本会自动检测设备类型，在手机或平板等移动设备上运行时，将自动禁用跳转功能，避免意外重定向。
- **高效稳定**：使用正则规则进行匹配，命中后立即重定向。
- **易于扩展**：代码结构清晰，方便开发者添加新的网站支持规则。

## 支持的网站

目前，脚本支持以下网站的自动跳转：

- **京东 (JD.com)**
  - 商品详情页
  - 店铺首页
  - 推广中间链接（`re.jd.com`）
- **哔哩哔哩 (Bilibili)**
  - 视频播放页（兼容 `m.bilibili.com` 和 `www.bilibili.com/mobile`，支持 `BV/bv`、`av`）
  - 番剧播放页（`ep`、`ss`）
- **天猫 (Tmall)**
  - 商品详情页
- **淘宝 (Taobao)**
  - 商品详情页
- **亚马逊 (Amazon)**
  - 移动商品详情页（`/gp/aw/d*`、`/gp/aw/dp*`、`/gp/aw/product*`）
  - 元信息采用 `@include` + 常见站点 `@match` 组合，提升脚本管理器兼容性
- **AliExpress**
  - `m.aliexpress.com` 页面
- **新浪微博 (Weibo)**
  - 状态页（`/status/`、`/detail/`）
  - 用户页（`/u/`、`/profile/`）
- **知乎 (Zhihu)**
  - 问题、回答页（`m.zhihu.com/question/...`）
  - 文章页（`m.zhihu.com/p/...` -> `zhuanlan.zhihu.com/p/...`）
- **维基百科 (Wikipedia)**
  - 多语言移动子域页面（`{lang}.m.wikipedia.org/...` -> `{lang}.wikipedia.org/...`）
- **豆瓣 (Douban)**
  - 电影详情页
  - 图书详情页
  - 音乐详情页
- **什么值得买 (SMZDM)**
  - 内容页（仅 `/p/{id}/`，`m.smzdm.com`、`post.m.smzdm.com`）
- **Facebook**
  - `m.facebook.com` 页面
- **X/Twitter**
  - `mobile.twitter.com` 页面
- **WikiHow**
  - `m.wikihow.com` 页面
- **掘金 (Juejin)**
  - `m.juejin.cn/post/...` 文章页
- **CSDN**
  - `m.blog.csdn.net/.../article/details/...` 博客页

## 安装指南

1. **安装用户脚本管理器**：在桌面浏览器（如 Chrome、Firefox、Edge）安装用户脚本管理器，推荐 [Tampermonkey](https://www.tampermonkey.net/)。
2. **安装本脚本**：
   - 打开 `mobile-to-pc.js` 文件。
   - 复制全部内容。
   - 在 Tampermonkey 管理面板点击“添加新脚本”（`+`）。
   - 粘贴并保存。

## 使用方法

安装完成后，脚本会自动在后台运行。当你在桌面浏览器中打开受支持站点的移动版链接时，会自动跳转到PC版页面。

## 手工测试清单

以下链接可用于快速验证脚本行为（建议在桌面浏览器中测试）：

- 应跳转：
  - `https://item.m.jd.com/product/100016046842.html` -> `https://item.jd.com/100016046842.html`
  - `https://re.jd.com/cps/item/100012043978.html?cu=true` -> `https://item.jd.com/100012043978.html`
  - `https://shop.m.jd.com/shop/home/abc-123` -> `https://shop.jd.com/home/popup/shopHome.html?id=abc-123`
  - `https://h5.m.taobao.com/awp/core/detail.htm?id=123456` -> `https://item.taobao.com/item.htm?id=123456`
  - `https://detail.m.tmall.com/item.htm?id=123456` -> `https://detail.tmall.com/item.htm?id=123456`
  - `https://m.bilibili.com/video/BV1xx411c7mD?p=2&t=120` -> `https://www.bilibili.com/video/BV1xx411c7mD/`
  - `https://m.bilibili.com/video/bv1xx411c7mD` -> `https://www.bilibili.com/video/bv1xx411c7mD/`
  - `https://m.bilibili.com/bangumi/play/ep90849` -> `https://www.bilibili.com/bangumi/play/ep90849`
  - `https://zh.m.wikipedia.org/wiki/JavaScript` -> `https://zh.wikipedia.org/wiki/JavaScript`
  - `https://m.zhihu.com/p/123456789` -> `https://zhuanlan.zhihu.com/p/123456789`
  - `https://m.douban.com/movie/subject/1292052/` -> `https://movie.douban.com/subject/1292052/`
  - `https://m.smzdm.com/p/123456/` -> `https://smzdm.com/p/123456/`
  - `https://m.facebook.com/zuck` -> `https://www.facebook.com/zuck`
  - `https://mobile.twitter.com/jack` -> `https://x.com/jack`
  - `https://www.amazon.com/gp/aw/d/B08N5WRWNW?psc=1` -> `https://www.amazon.com/dp/B08N5WRWNW`
  - `https://m.aliexpress.com/item/1005001234567890.html` -> `https://www.aliexpress.com/item/1005001234567890.html`
  - `https://m.wikihow.com/Make-Tea` -> `https://www.wikihow.com/Make-Tea`
  - `https://m.juejin.cn/post/7141264232471447582` -> `https://juejin.cn/post/7141264232471447582`
  - `https://m.blog.csdn.net/weixin_42010722/article/details/129855276` -> `https://blog.csdn.net/weixin_42010722/article/details/129855276`

- 不应跳转：
  - `https://m.weibo.cn/`
  - `https://m.douban.com/`
  - `https://m.smzdm.com/`（非内容页）
  - `https://m.something-example.com/`

## 参考来源

本次规则补充主要参考了以下同类项目与索引：

- GitHub：`IRainman/user_scripts`（AliExpress mobile to desktop）
- OpenUserJS：Wikipedia/Facebook 移动转桌面脚本
- Userscript.zone：`Mobile Twitter Redirect`、`Amazon Mobile to Desktop Redirect`、`Mobile Taobao to Desktop`、`Always desktop Wikihow` 等条目
- GreasyFork：通过 userscript.zone 聚合结果确认了上述脚本条目（当前网络环境直连 GreasyFork 超时）

## 如何贡献

欢迎通过 Issue 或 Pull Request 提交新站点规则、边界场景和修复建议。

## 许可证

本项目基于 [MIT 许可证](https://opensource.org/licenses/MIT) 开源。
