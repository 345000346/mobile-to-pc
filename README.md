# 手机网页转PC网页 (Mobile to Desktop Website Redirector)

[![Tampermonkey](https://img.shields.io/badge/Tampermonkey-4.13+-green)](https://www.tampermonkey.net/)

这是一个 Tampermonkey 脚本，旨在将常见网站的手机版网页自动重定向到其对应的 PC 版网页，从而提供更佳的桌面浏览体验。

## 功能特性

- 自动识别并重定向手机版网页
- 支持多个主流中文网站
- 高效的正则表达式匹配
- 易于扩展的规则配置
- 详细的日志记录

## 安装

1. 在您的浏览器中安装 [Tampermonkey](https://www.tampermonkey.net/) 扩展。
2. 复制脚本代码（您可以在此仓库的脚本文件中找到最新版本）。
3. 在 Tampermonkey 的管理面板中，点击“添加新脚本”。
4. 粘贴复制的代码并保存。

## 使用方法

安装完成后，当您访问以下网站的手机版页面时，脚本会自动将其重定向到相应的 PC 版页面：

* **京东：** 支持商品详情页和店铺首页的转换。
* **哔哩哔哩：** 支持视频页的转换（包括 av 号和 bv 号）。
* **天猫：** 支持商品详情页的转换。
* **淘宝：** 支持商品详情页的转换。
* **新浪微博：** 支持微博页面的转换。
* **知乎：** 支持文章和问题页面的转换。
* **豆瓣：** 支持页面转换。

### 转换规则示例

以下是一些转换规则的示例，展示了手机版 URL 如何转换为 PC 版 URL：

* **京东商品详情页：**
    * 手机版：`https://item.m.jd.com/product/12345.html` 或 `https://item.m.jd.com/ware/view.action?wareId=12345`
    * PC 版：`https://item.jd.com/12345.html`
* **京东店铺首页：**
    * 手机版：`https://shop.m.jd.com/shop/home/12345.html`
    * PC 版：`https://shop.jd.com/home/popup/shopHome.html?id=12345`
* **哔哩哔哩视频页：**
    * 手机版：`https://www.bilibili.com/mobile/video/av12345.html` 或 `https://www.bilibili.com/mobile/video/BV1xxxxxxxxxx.html`
    * PC 版：`https://www.bilibili.com/video/av12345/` 或 `https://www.bilibili.com/video/BV1xxxxxxxxxx/`
* **天猫商品详情页：**
    * 手机版：`https://detail.m.tmall.com/item.htm?id=12345`
    * PC 版：`https://detail.tmall.com/item.htm?id=12345`
* **淘宝商品详情页：**
    * 手机版：`https://h5.m.taobao.com/awp/core/detail.htm?id=12345`
    * PC 版：`https://item.taobao.com/item.htm?id=12345`
* **新浪微博：**
    * 手机版：`https://m.weibo.cn/status/xxxxxxxxxxxxxxxxx`
    * PC 版：`https://weibo.com/status/xxxxxxxxxxxxxxxxx`
* **知乎问题页：**
    * 手机版：`https://www.zhihu.com/question/12345`
    * PC 版：`https://www.zhihu.com/question/12345`
* **知乎文章页：**
    * 手机版：`https://zhuanlan.zhihu.com/p/12345`
    * PC 版：`https://zhuanlan.zhihu.com/p/12345`
* **豆瓣：**
    * 手机版：`https://m.douban.com/xxx`
    * PC 版：`https://www.douban.com/xxx`

## 技术细节

- **正则表达式匹配：** 使用高效的正则表达式进行URL匹配
- **规则配置：** 使用数组存储URL转换规则，方便扩展
- **错误处理：** 完善的错误处理机制，确保脚本稳定性
- **性能优化：** 优化了正则表达式的处理，提高了性能

## 更新日志

* **v0.7 (当前)**
    * 添加了命名空间，防止脚本冲突。
    * 统一使用模板字符串，代码更简洁。
    * 优化了注释和代码结构，提高可读性和可维护性。
    * 支持更多网站：添加了对新浪微博、知乎、豆瓣的支持。
    * 优化了正则表达式的处理，提高了性能。
    * 优化了代码性能和可扩展性。
    * 使用数组存储 URL 转换规则，方便添加新的规则。
    * 添加了详细的注释和文档。
* **v0.6**
    * 初始版本，支持京东、B站、淘宝、天猫的手机版到 PC 版转换。

## 贡献

欢迎提交 issue 和 pull request。如果您想贡献代码，请确保代码风格与现有代码保持一致，并添加相应的测试和文档。

## 许可证

本项目使用 MIT 许可证。