# 手机网页转PC网页 (Mobile to PC Redirector)

[![Tampermonkey](https://img.shields.io/badge/Tampermonkey-兼容-green)](https://www.tampermonkey.net/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

这是一个为桌面浏览器设计的用户脚本（User Script），旨在将多个主流网站的手机版（M站）网页自动重定向到其对应的PC版网页，以提供更佳的浏览体验。

## 核心功能

- **自动重定向**：无需任何手动操作，访问移动版页面时自动跳转。
- **广泛的网站支持**：覆盖了多个主流中文网站。
- **移动设备豁免**：脚本会自动检测设备类型，在手机或平板等移动设备上运行时，将自动禁用跳转功能，避免意外重定向。
- **高效稳定**：使用经过优化的正则表达式进行匹配，确保了高效和准确的重定向。
- **易于扩展**：代码结构清晰，方便开发者添加新的网站支持规则。

## 支持的网站

目前，脚本支持以下网站的自动跳转：

- **京东 (JD.com)**
  - 商品详情页
  - 店铺首页
- **哔哩哔哩 (Bilibili)**
  - 视频播放页 (兼容 `m.bilibili.com` 和 `www.bilibili.com/mobile` 域名)
- **天猫 (Tmall)**
  - 商品详情页
- **淘宝 (Taobao)**
  - 商品详情页
- **新浪微博 (Weibo)**
  - 状态页（`/status/`、`/detail/`）
  - 用户页（`/u/`、`/profile/`）
- **知乎 (Zhihu)**
  - 问题、回答及文章页（`m.zhihu.com`）
- **豆瓣 (Douban)**
  - 电影详情页
  - 图书详情页
  - 音乐详情页
- **什么值得买 (SMZDM)**
  - 移动版内容页（`m.smzdm.com`、`post.m.smzdm.com`）
- **京东推广链接 (re.jd.com)**
  - 推广中间链接自动转换为商品标准页

## 安装指南

1.  **安装用户脚本管理器**：您需要在您的桌面浏览器（如 Chrome, Firefox, Edge）上安装一个用户脚本管理器。推荐使用 [**Tampermonkey**](https://www.tampermonkey.net/)。
2.  **安装本脚本**：
    - 打开 `mobile-to-pc.js` 文件。
    - 复制文件的全部内容。
    - 在 Tampermonkey 的管理面板中，点击“添加新脚本”图标（`+`号）。
    - 将复制的代码粘贴到编辑器中，然后保存。

## 使用方法

安装完成后，脚本将自动在后台运行。当您在桌面浏览器上打开任何受支持网站的移动版链接时，它将无缝地将您重定向到PC版页面。

## 如何贡献

我们欢迎任何形式的贡献！如果您发现了一个脚本不支持的网站，或者现有的规则存在问题，请随时通过以下方式参与：

-   **提交 Issue**：在项目仓库中提交一个 Issue，详细描述您遇到的问题或功能建议。
-   **发送 Pull Request**：如果您熟悉 Git 和 JavaScript，可以直接 Fork 本项目，在修改或添加规则后，向我们提交 Pull Request。

## 许可证

本项目基于 [MIT 许可证](https://opensource.org/licenses/MIT) 开源。
