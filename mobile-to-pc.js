// ==UserScript==
// @name         将手机版网页转换为PC版网页
// @namespace    none
// @version      1.1
// @description  将京东、B站、淘宝、天猫、微博、知乎、豆瓣手机版网页转换为PC版网页
// @author       owovo
// @match        *://item.m.jd.com/*
// @match        *://www.bilibili.com/mobile/video/*
// @match        *://detail.m.tmall.com/*
// @match        *://h5.m.taobao.com/*
// @match        *://shop.m.jd.com/*
// @match        *://m.weibo.cn/*
// @match        *://zhuanlan.zhihu.com/p/*
// @match        *://www.zhihu.com/question/*
// @match        *://m.douban.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // URL转换规则配置
    const urlRules = [
        {
            // 京东商品详情页
            regex: /^https?:\/\/item\.m\.jd\.com\/(?:product\/(\d+)|detail\/(\d+))\.html(?:[\?#].*)?$/,
            replace: (match, p1, p2) => `https://item.jd.com/${p1 || p2}.html`,
            description: "京东商品详情页转换（product/ 或 detail/ 路径）"
        },
        {
            regex: /^https?:\/\/item\.m\.jd\.com\/ware\/view\.action\?.*wareId=(\d+).*$/,
            replace: 'https://item.jd.com/$1.html',
            description: "京东商品详情页转换（wareId 参数）"
        },
        {
            // 京东店铺首页
            regex: /^https?:\/\/shop\.m\.jd\.com\/shop\/home\/(\w+)\.html$/,
            replace: 'https://shop.jd.com/home/popup/shopHome.html?id=$1',
            description: "京东店铺首页转换"
        },
        {
            // 哔哩哔哩
            regex: /^https?:\/\/www\.bilibili\.com\/mobile\/video\/(av\d+|bv\w+)\.html$/,
            replace: 'https://www.bilibili.com/video/$1/',
            description: "哔哩哔哩视频页转换（支持 av 号和 bv 号）"
        },
        {
            // 天猫
            regex: /^https?:\/\/detail\.m\.tmall\.com\/item\.htm\?(.*)$/,
            replace: (match, params) => {
                try {
                    const id = new URLSearchParams(params).get('id');
                    return id && `https://detail.tmall.com/item.htm?id=${id}`;
                } catch (error) {
                    return null;
                }
            },
            description: "天猫商品详情页转换（使用 URLSearchParams 处理参数）"
        },
        {
            // 淘宝
            regex: /^https?:\/\/h5\.m\.taobao\.com\/awp\/core\/detail\.htm\?(.*)$/,
            replace: (match, params) => {
                try {
                    const id = new URLSearchParams(params).get('id');
                    return id && `https://item.taobao.com/item.htm?id=${id}`;
                } catch (error) {
                    return null;
                }
            },
            description: "淘宝商品详情页转换（使用 URLSearchParams 处理参数）"
        },
        {
            // 新浪微博
            regex: /^https?:\/\/m\.weibo\.cn\/(.*)$/,
            replace: 'https://weibo.com/$1',
            description: "新浪微博转换"
        },
        {
            // 知乎（文章）
            regex: /^https?:\/\/zhuanlan\.zhihu\.com\/p\/(.*)$/,
            replace: 'https://zhuanlan.zhihu.com/p/$1',
            description: "知乎文章转换"
        },
        {
            // 知乎（问题）
            regex: /^https?:\/\/www\.zhihu\.com\/question\/(\d+)(\/.*)?$/,
            replace: (match, questionId, subPath) => {
                // 保留子路径（如 /answer/123456）
                return `https://www.zhihu.com/question/${questionId}${subPath || ''}`;
            },
            description: "知乎问题转换（保留子路径）"
        },
        {
            // 豆瓣
            regex: /^https?:\/\/m\.douban\.com\/(.*)$/,
            replace: 'https://www.douban.com/$1',
            description: "豆瓣转换"
        }
    ];

    // 工具函数
    const utils = {
        isValidUrl: (url) => {
            try {
                new URL(url);
                return true;
            } catch (e) {
                return false;
            }
        },

        safeReplaceUrl: (url, regex, replace) => {
            try {
                const newUrl = typeof replace === 'function' 
                    ? url.replace(regex, replace)
                    : url.replace(regex, replace);
                return utils.isValidUrl(newUrl) ? newUrl : null;
            } catch (e) {
                return null;
            }
        }
    };

    // 主逻辑
    try {
        const currentUrl = window.location.href;

        const matchedRule = urlRules.find(rule => {
            const { regex, replace } = rule;
            const newUrl = utils.safeReplaceUrl(currentUrl, regex, replace);

            if (newUrl && newUrl !== currentUrl) {
                window.location.replace(newUrl);
                return true;
            }
            return false;
        });
    } catch (e) {
        console.error('URL conversion failed');
    }
})();