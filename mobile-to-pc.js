// ==UserScript==
// @name         将手机版网页转换为PC版网页
// @namespace    https://github.com/345000346/mobile-to-pc
// @version      2.3
// @description  将京东、B站、淘宝、天猫、微博、豆瓣、贴吧、虎扑、NGA、萌百、什么值得买、Amazon、AliExpress、Bangumi、虎嗅、澎湃、IT之家、搜狐、网易新闻、腾讯新闻等手机版/中间页自动跳转到PC版
// @author       owovo
// @homepageURL  https://github.com/345000346/mobile-to-pc
// @supportURL   https://github.com/345000346/mobile-to-pc/issues
// @license      MIT
// @match        *://item.m.jd.com/*
// @match        *://shop.m.jd.com/*
// @match        *://www.bilibili.com/mobile/video/*
// @match        *://m.tmall.com/*
// @match        *://detail.m.tmall.com/*
// @match        *://h5.m.taobao.com/*
// @match        *://m.intl.taobao.com/*
// @match        *://m.weibo.cn/*
// @match        *://m.douban.com/*
// @match        *://m.smzdm.com/*
// @match        *://m.aliexpress.com/*
// @match        *://mzh.moegirl.org.cn/*
// @match        *://jump2.bdimg.com/p/*
// @match        *://m.hupu.com/*
// @match        *://ngabbs.com/*
// @match        *://bgm.tv/m
// @match        *://bgm.tv/m/*
// @match        *://bangumi.tv/m
// @match        *://bangumi.tv/m/*
// @match        *://chii.in/m
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
// @match        *://m.huxiu.com/*
// @match        *://m.thepaper.cn/*
// @match        *://m.ithome.com/*
// @match        *://m.sohu.com/*
// @match        *://m.163.com/dy/article/*
// @match        *://view.inews.qq.com/a/*
// @downloadURL  https://update.greasyfork.org/scripts/389749/mobile-to-pc.user.js
// @updateURL    https://update.greasyfork.org/scripts/389749/mobile-to-pc.meta.js
// @grant        none
// @run-at       document-start
// @noframes
// ==/UserScript==

/**
 * 架构：host 表分发 → 站内规则改写 → replace
 *
 * - BY_HOST[hostname]：精确 host 的处理函数
 * - 组合子：keep / rewrite / first；站内规则不读 hostname
 * - 已由站点服务器 301/302 接管的移动域不再保留规则
 */
(function () {
    'use strict';

    const ua = navigator.userAgent;
    // iPadOS 13+ 默认发送桌面 UA（含 Macintosh），但 maxTouchPoints > 1
    const isTouchMac = /Macintosh/i.test(ua) && (navigator.maxTouchPoints || 0) > 1;
    if (isTouchMac || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i.test(ua)) {
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
            const id = url.pathname.slice('/zone/'.length);
            return `https://bbs.hupu.com/${id}${url.search}${url.hash}`;
        }
        return null;
    };

    const amazonAw = rewrite(
        /(?:^|\/)(?:-\/[a-zA-Z0-9_-]+\/)?gp\/aw\/(?:d|dp|product)\/([A-Z0-9]{10})(?:\/|$)/i,
        (m, url) => `https://${url.hostname}/dp/${m[1]}`
    );

    /** Bangumi：/m 入口去 rakuen，/m/topic/** 按 PC 路径重排，其余 /m/** 去前缀 */
    const BGM_TOPIC = {
        group: 'group/topic',
        subject: 'subject/topic',
        ep: 'ep',
        prsn: 'person',
        crt: 'character'
    };

    const bgmM = (url) => {
        const path = url.pathname;
        if (path === '/m' || path === '/m/') return 'https://bgm.tv/rakuen';
        if (path.startsWith('/m/topic/')) {
            const [kind, id] = path.slice('/m/topic/'.length).split('/');
            if (BGM_TOPIC[kind] && /^\d+$/.test(id)) {
                return `https://bgm.tv/${BGM_TOPIC[kind]}/${id}${url.search}${url.hash}`;
            }
            return null;
        }
        if (path.startsWith('/m/')) {
            return `https://bgm.tv${path.slice(2)}${url.search}${url.hash}`;
        }
        return null;
    };

    /** IT之家：/html/{ID}.htm → /0/{前3位}/{剩余}.htm */
    const ithomeArticle = rewrite(/^\/html\/(\d+)\.htm\/?$/i, (m) => {
        const id = m[1];
        if (id.length < 4) return null;
        return `https://www.ithome.com/0/${id.slice(0, 3)}/${id.slice(3)}.htm`;
    });

    /** 网易新闻：/dy/article/{ID}.html → www.163.com */
    const neteaseArticle = rewrite(
        /^\/dy\/article\/([A-Za-z0-9]+)\.html\/?$/i,
        (m) => `https://www.163.com/dy/article/${m[1]}.html`
    );

    // --- host → 规则 ---

    /** @type {Record<string, Rule>} */
    const BY_HOST = {
        // 京东
        'item.m.jd.com': jdItemM,
        'shop.m.jd.com': jdShop,

        // 淘宝 / 天猫
        'detail.m.tmall.com': taobaoItem('https://detail.tmall.com/item.htm'),
        'm.tmall.com': taobaoItem('https://detail.tmall.com/item.htm'),
        'h5.m.taobao.com': taobaoItem('https://item.taobao.com/item.htm'),
        'm.intl.taobao.com': taobaoItem('https://item.taobao.com/item.htm'),

        // 社交
        'm.weibo.cn': first(
            rewrite(/^\/(?:status|detail)\/([a-zA-Z0-9]+)\/?$/i, (m) => `https://weibo.com/detail/${m[1]}`),
            rewrite(/^\/(?:u|profile)\/(\d+)\/?$/i, (m) => `https://weibo.com/u/${m[1]}`)
        ),

        // 论坛 / 中间页
        'mzh.moegirl.org.cn': keep('https://zh.moegirl.org.cn'),
        'jump2.bdimg.com': rewrite(
            /^\/p\/(\d+)\/?$/i,
            (m, url) => `https://tieba.baidu.com/p/${m[1]}${url.search}${url.hash}`
        ),
        'm.hupu.com': hupu,
        'ngabbs.com': keep('https://bbs.nga.cn'),
        'bgm.tv': bgmM,
        'bangumi.tv': bgmM,
        'chii.in': bgmM,

        // 内容
        'www.bilibili.com': biliVideo,
        'm.douban.com': rewrite(
            /^\/(movie|book|music)\/subject\/(\d+)\/?$/i,
            (m) => `https://${m[1].toLowerCase()}.douban.com/subject/${m[2]}/`
        ),
        'm.smzdm.com': first(
            rewrite(/^\/p\/(\d+)\/?$/i, (m) => `https://www.smzdm.com/p/${m[1]}/`),
            rewrite(/^\/p\/([a-z][a-z0-9]+)\/?$/i, (m) => `https://post.smzdm.com/p/${m[1]}/`)
        ),
        'm.aliexpress.com': rewrite(
            /^\/(item\/\d+\.html|store\/\d+)\/?$/i,
            (m) => `https://www.aliexpress.com/${m[1]}`
        ),

        // 新闻 / 资讯
        'm.huxiu.com': keep('https://www.huxiu.com'),
        'm.thepaper.cn': keep('https://www.thepaper.cn'),
        'm.ithome.com': ithomeArticle,
        'm.sohu.com': keep('https://www.sohu.com'),
        'm.163.com': neteaseArticle,
        'view.inews.qq.com': rewrite(
            /^\/a\/(\d{8}[A-Za-z0-9]+)\/?$/i,
            (m) => `https://news.qq.com/rain/a/${m[1]}`
        )
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

    const url = new URL(location.href);
    const next = BY_HOST[url.hostname]?.(url);
    if (next && next !== url.href) {
        location.replace(next);
    }
})();
