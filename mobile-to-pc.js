// ==UserScript==
// @name         将手机版网页转换为PC版网页
// @namespace    https://github.com/345000346/mobile-to-pc
// @version      2.1
// @description  将京东、B站、淘宝、天猫、微博、知乎、豆瓣、贴吧、虎扑、NGA、萌百、什么值得买、维基百科等手机版/中间页自动跳转到PC版
// @author       owovo
// @homepageURL  https://github.com/345000346/mobile-to-pc
// @supportURL   https://github.com/345000346/mobile-to-pc/issues
// @license      MIT
// @match        *://item.m.jd.com/*
// @match        *://shop.m.jd.com/*
// @match        *://re.jd.com/cps/item/*
// @match        *://mitem.jd.com/*
// @match        *://wqitem.jd.com/*
// @match        *://m.yiyaojd.com/*
// @match        *://m.jd.hk/*
// @match        *://m.bilibili.com/*
// @match        *://www.bilibili.com/mobile/video/*
// @match        *://m.tmall.com/*
// @match        *://detail.m.tmall.com/*
// @match        *://h5.m.taobao.com/*
// @match        *://m.intl.taobao.com/*
// @match        *://m.weibo.cn/*
// @match        *://m.zhihu.com/*
// @match        *://m.douban.com/*
// @match        *://m.smzdm.com/*
// @match        *://post.m.smzdm.com/*
// @match        *://*.m.wikipedia.org/*
// @match        *://*.m.wiktionary.org/*
// @match        *://*.m.wikibooks.org/*
// @match        *://*.m.wikinews.org/*
// @match        *://*.m.wikisource.org/*
// @match        *://*.m.wikiversity.org/*
// @match        *://*.m.wikivoyage.org/*
// @match        *://*.m.wikiquote.org/*
// @match        *://m.wikidata.org/*
// @match        *://m.mediawiki.org/*
// @match        *://m.facebook.com/*
// @match        *://mobile.twitter.com/*
// @match        *://m.aliexpress.com/*
// @match        *://m.wikihow.com/*
// @match        *://m.juejin.cn/*
// @match        *://m.blog.csdn.net/*
// @match        *://mzh.moegirl.org.cn/*
// @match        *://mzh.moegirl.org.cn.cc/*
// @match        *://jump2.bdimg.com/p/*
// @match        *://m.hupu.com/*
// @match        *://ngabbs.com/*
// @match        *://nga.178.com/*
// @match        *://bgm.tv/m/*
// @match        *://bangumi.tv/m/*
// @match        *://chii.in/m/*
// @match        *://www.amazon.com/gp/aw/*
// @match        *://www.amazon.co.uk/gp/aw/*
// @match        *://www.amazon.de/gp/aw/*
// @match        *://www.amazon.fr/gp/aw/*
// @match        *://www.amazon.it/gp/aw/*
// @match        *://www.amazon.es/gp/aw/*
// @match        *://www.amazon.co.jp/gp/aw/*
// @match        *://www.amazon.ca/gp/aw/*
// @match        *://www.amazon.com.au/gp/aw/*
// @match        *://www.amazon.in/gp/aw/*
// @downloadURL  https://update.greasyfork.org/scripts/389749/mobile-to-pc.user.js
// @updateURL    https://update.greasyfork.org/scripts/389749/mobile-to-pc.meta.js
// @grant        none
// @run-at       document-start
// @noframes
// ==/UserScript==

/**
 * 架构：host 表分发 → 站内规则改写 → replace
 *
 * - BY_HOST[hostname]：精确 host 的处理函数（主路径）
 * - wikiMobile：host 本身带变量时的第二分发（维基 *.m.*）
 * - 组合子：keep / rewrite / first；站内规则不再读 hostname
 */
(function () {
    'use strict';

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i.test(navigator.userAgent)) {
        return;
    }

    /** @typedef {(url: URL) => string|null} Rule */

    /** @param {URL} url @param {string} key */
    const numParam = (url, key) => {
        const v = url.searchParams.get(key);
        return v && /^\d+$/.test(v) ? v : null;
    };

    /** @param {string} href @param {URL} src @param {string[]} keys */
    const withParams = (href, src, keys) => {
        const u = new URL(href);
        for (const k of keys) {
            const v = src.searchParams.get(k);
            if (v) u.searchParams.set(k, v);
        }
        return u.href;
    };

    /** 换域，保留 path / search / hash */
    const keep = (origin) => /** @type {Rule} */ (url) =>
        origin + url.pathname + url.search + url.hash;

    /** pathname 正则命中则 build；已在 host 分发之后，不再检查 host */
    const rewrite =
        (pathRe, build) =>
        /** @type {Rule} */
        (url) => {
            const m = url.pathname.match(pathRe);
            return m ? build(m, url) : null;
        };

    /** 按序尝试，返回首个非 null */
    const first =
        (...rules) =>
        /** @type {Rule} */
        (url) => {
            for (const rule of rules) {
                const next = rule(url);
                if (next) return next;
            }
            return null;
        };

    // --- 站内规则（无 host 耦合）---

    const jdItemM = first(
        rewrite(/^\/(?:product|detail)\/(\d+)(?:\.html)?\/?$/i, (m) => `https://item.jd.com/${m[1]}.html`),
        (url) => {
            if (!/\/ware\/view\.action$/i.test(url.pathname)) return null;
            const id = numParam(url, 'wareId');
            return id ? `https://item.jd.com/${id}.html` : null;
        }
    );

    const jdAltProduct = (origin) =>
        rewrite(/^\/product\/(\d+)\.html$/i, (m) => `${origin}/${m[1]}.html`);

    const jdShop = first(
        rewrite(/^\/shop\/home\/([\w-]+)(?:\.html)?\/?$/i, (m) => `https://mall.jd.com/index-${m[1]}.html`),
        (url) => {
            const id = numParam(url, 'shopId') || numParam(url, 'id');
            return id ? `https://mall.jd.com/index-${id}.html` : null;
        }
    );

    const taobaoItem = (pcBase) => (url) => {
        if (!/\/(?:item\.htm|awp\/core\/detail\.htm|detail\/detail\.html|i\d+\.htm)$/i.test(url.pathname)) return null;
        const id = numParam(url, 'id') ?? url.pathname.match(/\/i(\d+)\.htm$/i)?.[1];
        if (!id) return null;
        return withParams(`${pcBase}?id=${id}`, url, ['skuId']);
    };

    const biliVideo = rewrite(
        /^\/(?:mobile\/)?video\/(av\d+|[Bb][Vv][a-zA-Z0-9]+)\/?$/i,
        (m, url) => withParams(`https://www.bilibili.com/video/${m[1]}/`, url, ['p', 't'])
    );

    const hupu = (url) => {
        if (url.pathname.startsWith('/bbs/')) {
            return `https://bbs.hupu.com/${url.pathname.slice(5)}${url.search}${url.hash}`;
        }
        if (url.pathname === '/zone' || url.pathname.startsWith('/zone/')) {
            return `https://bbs.hupu.com${url.pathname}${url.search}${url.hash}`;
        }
        return null;
    };

    const amazonAw = rewrite(
        /(?:^|\/)(?:-\/[a-zA-Z0-9_-]+\/)?gp\/aw\/(?:d|dp|product)\/([A-Z0-9]{10})(?:\/|$)/i,
        (m, url) => `https://${url.hostname}/dp/${m[1]}`
    );

    const bgmM = (url) =>
        url.pathname.startsWith('/m/') ? 'https://bgm.tv/rakuen' : null;

    // --- host → 规则 ---

    /** @type {Record<string, Rule>} */
    const BY_HOST = {
        // 京东
        'item.m.jd.com': jdItemM,
        'mitem.jd.com': jdAltProduct('https://item.jd.com'),
        'wqitem.jd.com': jdAltProduct('https://item.jd.com'),
        'm.yiyaojd.com': jdAltProduct('https://item.jd.com'),
        'm.jd.hk': jdAltProduct('https://item.jd.hk'),
        'shop.m.jd.com': jdShop,
        're.jd.com': rewrite(/^\/cps\/item\/(\d+)\.html$/i, (m) => `https://item.jd.com/${m[1]}.html`),

        // 淘宝 / 天猫
        'detail.m.tmall.com': taobaoItem('https://detail.tmall.com/item.htm'),
        'm.tmall.com': taobaoItem('https://detail.tmall.com/item.htm'),
        'h5.m.taobao.com': taobaoItem('https://item.taobao.com/item.htm'),
        'm.intl.taobao.com': taobaoItem('https://item.taobao.com/item.htm'),

        // 社交
        'm.facebook.com': keep('https://www.facebook.com'),
        'mobile.twitter.com': keep('https://x.com'),
        'm.weibo.cn': first(
            rewrite(/^\/(?:status|detail)\/([a-zA-Z0-9]+)\/?$/i, (m) => `https://weibo.com/detail/${m[1]}`),
            rewrite(/^\/(?:u|profile)\/(\d+)\/?$/i, (m) => `https://weibo.com/u/${m[1]}`)
        ),
        'm.zhihu.com': first(
            rewrite(/^\/(question\/\d+(?:\/answer\/\d+)?)\/?$/i, (m) => `https://www.zhihu.com/${m[1]}`),
            rewrite(/^\/p\/(\d+)\/?$/i, (m) => `https://zhuanlan.zhihu.com/p/${m[1]}`)
        ),

        // 论坛 / 中间页
        'mzh.moegirl.org.cn': keep('https://zh.moegirl.org.cn'),
        'mzh.moegirl.org.cn.cc': keep('https://zh.moegirl.org.cn'),
        'jump2.bdimg.com': rewrite(/^\/p\/(\d+)\/?$/i, (m) => `https://tieba.baidu.com/p/${m[1]}`),
        'm.hupu.com': hupu,
        'ngabbs.com': keep('https://bbs.nga.cn'),
        'nga.178.com': keep('https://bbs.nga.cn'),
        'bgm.tv': bgmM,
        'bangumi.tv': bgmM,
        'chii.in': bgmM,

        // 内容
        'm.bilibili.com': first(
            biliVideo,
            rewrite(/^\/bangumi\/play\/((?:ep|ss)\d+)\/?$/i, (m) => `https://www.bilibili.com/bangumi/play/${m[1]}`)
        ),
        'www.bilibili.com': biliVideo,
        'm.douban.com': rewrite(
            /^\/(movie|book|music)\/subject\/(\d+)\/?$/i,
            (m) => `https://${m[1].toLowerCase()}.douban.com/subject/${m[2]}/`
        ),
        'm.smzdm.com': rewrite(/^\/(p\/\d+)\/?$/i, (m) => `https://smzdm.com/${m[1]}/`),
        'post.m.smzdm.com': rewrite(/^\/(p\/\d+)\/?$/i, (m) => `https://post.smzdm.com/${m[1]}/`),
        'm.aliexpress.com': rewrite(
            /^\/(item\/\d+\.html|store\/\d+)\/?$/i,
            (m) => `https://www.aliexpress.com/${m[1]}`
        ),
        'm.wikihow.com': keep('https://www.wikihow.com'),
        'm.juejin.cn': rewrite(/^\/post\/(\d+)\/?$/i, (m) => `https://juejin.cn/post/${m[1]}`),
        'm.blog.csdn.net': rewrite(
            /^\/([^/]+)\/article\/details\/(\d+)\/?$/i,
            (m) => `https://blog.csdn.net/${m[1]}/article/details/${m[2]}`
        ),
        'm.wikidata.org': keep('https://www.wikidata.org'),
        'm.mediawiki.org': keep('https://www.mediawiki.org')
    };

    for (const h of [
        'www.amazon.com',
        'www.amazon.co.uk',
        'www.amazon.de',
        'www.amazon.fr',
        'www.amazon.it',
        'www.amazon.es',
        'www.amazon.co.jp',
        'www.amazon.ca',
        'www.amazon.com.au',
        'www.amazon.in'
    ]) {
        BY_HOST[h] = amazonAw;
    }

    /** host 形态本身可变时走这里（维基语种子域） */
    const WIKI_HOST =
        /^([a-z-]+)\.m\.(wikipedia|wiktionary|wikibooks|wikinews|wikisource|wikiversity|wikivoyage|wikiquote)\.org$/i;

    /** @type {Rule} */
    const wikiMobile = (url) => {
        const m = url.hostname.match(WIKI_HOST);
        return m ? `https://${m[1]}.${m[2]}.org${url.pathname}${url.search}${url.hash}` : null;
    };

    const url = new URL(location.href);
    const next = BY_HOST[url.hostname]?.(url) ?? wikiMobile(url);
    if (next && next !== url.href) {
        location.replace(next);
    }
})();
