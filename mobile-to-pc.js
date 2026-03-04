// ==UserScript==
// @name         将手机版网页转换为PC版网页
// @namespace    none
// @version      1.7
// @description  将京东、B站、淘宝、天猫、微博、知乎、豆瓣、什么值得买、维基百科、Facebook、X/Twitter、Amazon、AliExpress、WikiHow、掘金、CSDN 手机版网页转换为PC版网页
// @author       owovo
// @match        *://item.m.jd.com/*
// @match        *://shop.m.jd.com/*
// @match        *://m.bilibili.com/*
// @match        *://www.bilibili.com/mobile/video/*
// @match        *://m.tmall.com/*
// @match        *://detail.m.tmall.com/*
// @match        *://h5.m.taobao.com/*
// @match        *://m.weibo.cn/*
// @match        *://m.zhihu.com/*
// @match        *://*.m.wikipedia.org/*
// @match        *://m.douban.com/*
// @match        *://m.smzdm.com/*
// @match        *://post.m.smzdm.com/*
// @match        *://re.jd.com/cps/item/*
// @match        *://m.facebook.com/*
// @match        *://mobile.twitter.com/*
// @include      *://*.amazon.*/gp/aw/*
// @match        *://www.amazon.com/gp/aw/*
// @match        *://smile.amazon.com/gp/aw/*
// @match        *://www.amazon.co.uk/gp/aw/*
// @match        *://smile.amazon.co.uk/gp/aw/*
// @match        *://www.amazon.de/gp/aw/*
// @match        *://www.amazon.fr/gp/aw/*
// @match        *://www.amazon.it/gp/aw/*
// @match        *://www.amazon.es/gp/aw/*
// @match        *://www.amazon.co.jp/gp/aw/*
// @match        *://www.amazon.ca/gp/aw/*
// @match        *://www.amazon.com.au/gp/aw/*
// @match        *://www.amazon.in/gp/aw/*
// @match        *://m.aliexpress.com/*
// @match        *://m.wikihow.com/*
// @match        *://m.juejin.cn/*
// @match        *://m.blog.csdn.net/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const mobileUaRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/i;

    /**
     * @description 检测当前环境是否为移动设备。
     * @returns {boolean} 如果是移动设备，返回 true；否则返回 false。
     */
    const isMobile = () => mobileUaRegex.test(navigator.userAgent);

    // 如果是在移动设备上，则不执行任何操作，以避免在移动端浏览器上发生意外跳转。
    if (isMobile()) {
        return;
    }

    /**
     * @description URL转换规则对象结构。
     * @typedef {Object} UrlRule
     * @property {RegExp} regex 用于匹配移动版URL的正则表达式。
     * @property {string|Function} replace 替换目标PC版URL格式或处理函数。
     * @property {string} description 规则说明。
     */

    /** @type {UrlRule[]} */
    const ecommerceRules = [
        {
            // 京东商品详情页 (合并了 product, detail, wareId 等多种情况)
            regex: /^https?:\/\/item\.m\.jd\.com\/(?:product|detail|ware\/view\.action).*?(?:\/|wareId=)(\d+).*$/,
            replace: 'https://item.jd.com/$1.html',
            description: "京东商品详情页转换"
        },
        {
            // 京东店铺首页
            regex: /^https?:\/\/shop\.m\.jd\.com\/(?:shop\/home\/([\w-]+)|index\.action\?shopId=(\d+)).*$/,
            replace: (match, p1, p2) => `https://shop.jd.com/home/popup/shopHome.html?id=${p1 || p2}`,
            description: "京东店铺首页转换"
        },
        {
            // 京东推广中间链接
            regex: /^https?:\/\/re\.jd\.com\/cps\/item\/(\d+)\.html.*$/,
            replace: 'https://item.jd.com/$1.html',
            description: "京东推广链接转换"
        },
        {
            // 天猫
            regex: /^https?:\/\/(?:detail\.m\.tmall\.com|m\.tmall\.com)\/item\.htm\?.*id=(\d+).*$/,
            replace: 'https://detail.tmall.com/item.htm?id=$1',
            description: "天猫商品详情页转换"
        },
        {
            // 淘宝
            regex: /^https?:\/\/h5\.m\.taobao\.com\/awp\/core\/detail\.htm\?.*id=(\d+).*$/,
            replace: 'https://item.taobao.com/item.htm?id=$1',
            description: "淘宝商品详情页转换"
        },
        {
            // Amazon 移动商品页 (gp/aw/d, gp/aw/dp, gp/aw/product)
            regex: /^https?:\/\/((?:www|smile)\.amazon\.[^/]+)\/(?:-\/[a-zA-Z0-9_-]+\/)?gp\/aw\/(?:d|dp|product)\/([A-Z0-9]{10})(?:[/?].*)?$/i,
            replace: 'https://$1/dp/$2',
            description: "Amazon 移动商品页转换"
        },
        {
            // AliExpress
            regex: /^https?:\/\/m\.aliexpress\.com\/(.*)$/i,
            replace: 'https://www.aliexpress.com/$1',
            description: "AliExpress 移动版页面转换"
        },
        {
            // 什么值得买 (移动版内容页)
            regex: /^https?:\/\/(post\.)?m\.smzdm\.com\/(p\/\d+\/)(?:\?.*)?$/i,
            replace: 'https://$1smzdm.com/$2',
            description: "什么值得买移动版内容页转换"
        }
    ];

    /** @type {UrlRule[]} */
    const socialRules = [
        {
            // Facebook
            regex: /^https?:\/\/m\.facebook\.com\/(.*)$/i,
            replace: 'https://www.facebook.com/$1',
            description: "Facebook 移动版页面转换"
        },
        {
            // X/Twitter
            regex: /^https?:\/\/mobile\.twitter\.com\/(.*)$/i,
            replace: 'https://x.com/$1',
            description: "X/Twitter 移动版页面转换"
        },
        {
            // 新浪微博状态页
            regex: /^https?:\/\/m\.weibo\.cn\/(?:status|detail)\/([a-zA-Z0-9]+).*$/,
            replace: 'https://weibo.com/detail/$1',
            description: "新浪微博状态页转换"
        },
        {
            // 新浪微博用户页
            regex: /^https?:\/\/m\.weibo\.cn\/(?:u|profile)\/(\d+).*$/,
            replace: 'https://weibo.com/u/$1',
            description: "新浪微博用户页转换"
        },
        {
            // 知乎问题/回答页
            regex: /^https?:\/\/m\.zhihu\.com\/(question\/\d+(\/answer\/\d+)?)(?:\/|\?|$).*/,
            replace: 'https://www.zhihu.com/$1',
            description: "知乎问题/回答页转换"
        },
        {
            // 知乎文章页
            regex: /^https?:\/\/m\.zhihu\.com\/p\/(\d+)(?:\/|\?|$).*/,
            replace: 'https://zhuanlan.zhihu.com/p/$1',
            description: "知乎文章页转换"
        }
    ];

    /** @type {UrlRule[]} */
    const contentRules = [
        {
            // 哔哩哔哩视频页 (兼容 m.bilibili.com 和 www.bilibili.com/mobile)
            regex: /^https?:\/\/(?:m|www)\.bilibili\.com\/(?:mobile\/)?video\/(av\d+|[Bb][Vv][a-zA-Z0-9]+).*$/,
            replace: 'https://www.bilibili.com/video/$1/',
            description: "哔哩哔哩视频页转换"
        },
        {
            // 哔哩哔哩番剧播放页
            regex: /^https?:\/\/m\.bilibili\.com\/bangumi\/play\/((?:ep|ss)\d+)(?:\/|\?|$).*/,
            replace: 'https://www.bilibili.com/bangumi/play/$1',
            description: "哔哩哔哩番剧播放页转换"
        },
        {
            // 维基百科移动版页面
            regex: /^https?:\/\/([a-z-]+)\.m\.wikipedia\.org\/(.*)$/i,
            replace: 'https://$1.wikipedia.org/$2',
            description: "维基百科移动版页面转换"
        },
        {
            // 豆瓣电影详情页
            regex: /^https?:\/\/m\.douban\.com\/movie\/subject\/(\d+)\/?(?:\?.*)?$/,
            replace: 'https://movie.douban.com/subject/$1/',
            description: "豆瓣电影详情页转换"
        },
        {
            // 豆瓣图书详情页
            regex: /^https?:\/\/m\.douban\.com\/book\/subject\/(\d+)\/?(?:\?.*)?$/,
            replace: 'https://book.douban.com/subject/$1/',
            description: "豆瓣图书详情页转换"
        },
        {
            // 豆瓣音乐详情页
            regex: /^https?:\/\/m\.douban\.com\/music\/subject\/(\d+)\/?(?:\?.*)?$/,
            replace: 'https://music.douban.com/subject/$1/',
            description: "豆瓣音乐详情页转换"
        },
        {
            // WikiHow
            regex: /^https?:\/\/m\.wikihow\.com\/(.*)$/i,
            replace: 'https://www.wikihow.com/$1',
            description: "WikiHow 移动版页面转换"
        },
        {
            // 掘金移动版文章页
            regex: /^https?:\/\/m\.juejin\.cn\/post\/(\d+)(?:\?.*)?$/i,
            replace: 'https://juejin.cn/post/$1',
            description: "掘金移动版文章页转换"
        },
        {
            // CSDN 移动版博客页
            regex: /^https?:\/\/m\.blog\.csdn\.net\/([^\/]+)\/article\/details\/(\d+)(?:\?.*)?$/i,
            replace: 'https://blog.csdn.net/$1/article/details/$2',
            description: "CSDN 移动版博客页转换"
        }
    ];

    /** @type {UrlRule[]} */
    const urlRules = [
        ...ecommerceRules,
        ...socialRules,
        ...contentRules
    ];

    /**
     * @description 根据规则获取重定向目标地址。
     * @param {string} currentUrl 当前访问地址。
     * @returns {string|null} 命中规则返回新地址，否则返回 null。
     */
    const getRedirectUrl = (currentUrl) => {
        for (const rule of urlRules) {
            const newUrl = currentUrl.replace(rule.regex, rule.replace);

            if (newUrl && newUrl !== currentUrl) {
                return newUrl;
            }
        }

        return null;
    };

    // --- 主逻辑 ---
    // 脚本的核心执行部分。
    try {
        const currentUrl = window.location.href;
        const targetUrl = getRedirectUrl(currentUrl);

        // 确保URL有效且发生了变化，然后执行重定向。
        if (targetUrl) {
            window.location.replace(targetUrl);
        }
    } catch (e) {
        console.error('移动版到PC版URL转换脚本失败：', e);
    }
})();

