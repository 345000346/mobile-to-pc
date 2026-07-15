// ==UserScript==
// @name         将手机版网页转换为PC版网页
// @namespace    https://github.com/345000346/mobile-to-pc
// @version      1.9
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
// @match        *://www.bilibili.com/s/*
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
// @match        *://yues.org/*
// @match        *://bgm.tv/m/*
// @match        *://bangumi.tv/m/*
// @match        *://chii.in/m/*
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
// @downloadURL  https://update.greasyfork.org/scripts/389749/mobile-to-pc.user.js
// @updateURL    https://update.greasyfork.org/scripts/389749/mobile-to-pc.meta.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    const REDIRECT_GUARD_KEY = '__m2pc_last_src';
    const REDIRECT_GUARD_TS_KEY = '__m2pc_last_ts';
    const REDIRECT_GUARD_MS = 3000;

    const isMobile = () => {
        try {
            if (navigator.userAgentData && typeof navigator.userAgentData.mobile === 'boolean') {
                return navigator.userAgentData.mobile;
            }
        } catch (_) {
            /* ignore */
        }
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i.test(
            navigator.userAgent
        );
    };

    if (isMobile()) {
        return;
    }

    /** @typedef {(url: URL) => string|null} RuleFn */

    /** @param {URL} url @param {string} key @returns {string|null} */
    const numericQuery = (url, key) => {
        const v = url.searchParams.get(key);
        return v && /^\d+$/.test(v) ? v : null;
    };

    /**
     * @param {string} targetHref
     * @param {URL} source
     * @param {string[]} keys
     * @returns {string}
     */
    const copyParams = (targetHref, source, keys) => {
        const target = new URL(targetHref);
        for (const key of keys) {
            const v = source.searchParams.get(key);
            if (v) {
                target.searchParams.set(key, v);
            }
        }
        return target.href;
    };

    /**
     * 换 host，保留 path/search/hash。
     * @param {string|(h: string) => boolean} host  精确主机名，或 hostname 谓词
     * @param {string} origin
     * @returns {RuleFn}
     */
    const rehost = (host, origin) => (url) => {
        const ok = typeof host === 'function' ? host(url.hostname) : url.hostname === host;
        return ok ? origin + url.pathname + url.search + url.hash : null;
    };

    /**
     * host 谓词 + pathname 正则；build 只拿捕获结果。
     * @param {string|(h: string) => boolean} host
     * @param {RegExp} pathRe
     * @param {(m: RegExpMatchArray) => string} build
     * @returns {RuleFn}
     */
    const whenHostPath = (host, pathRe, build) => (url) => {
        const hostOk = typeof host === 'function' ? host(url.hostname) : url.hostname === host;
        if (!hostOk) {
            return null;
        }
        const m = url.pathname.match(pathRe);
        return m ? build(m) : null;
    };

    // --- 京东商品 ---
    const JD_ALT_PRODUCT_ORIGIN = {
        'mitem.jd.com': 'https://item.jd.com',
        'wqitem.jd.com': 'https://item.jd.com',
        'm.yiyaojd.com': 'https://item.jd.com',
        'm.jd.hk': 'https://item.jd.hk'
    };

    /** item.m：product|detail|ware/view.action */
    const jdItemM = (url) => {
        if (url.hostname !== 'item.m.jd.com') {
            return null;
        }
        const fromPath = url.pathname.match(/^\/(?:product|detail)\/(\d+)(?:\.html)?\/?$/i);
        if (fromPath) {
            return `https://item.jd.com/${fromPath[1]}.html`;
        }
        if (/\/ware\/view\.action$/i.test(url.pathname)) {
            const id = numericQuery(url, 'wareId');
            return id ? `https://item.jd.com/${id}.html` : null;
        }
        return null;
    };

    /** mitem / wqitem / 医药 / 香港：仅 product/{id}.html */
    const jdAltProduct = (url) => {
        const origin = JD_ALT_PRODUCT_ORIGIN[url.hostname];
        if (!origin) {
            return null;
        }
        const m = url.pathname.match(/^\/product\/(\d+)\.html$/i);
        return m ? `${origin}/${m[1]}.html` : null;
    };

    /** 店铺：/shop/home/{id} 或任意带 shopId/id 的 shop.m 链接 → mall.jd.com */
    const jdShop = (url) => {
        if (url.hostname !== 'shop.m.jd.com') {
            return null;
        }
        const home = url.pathname.match(/^\/shop\/home\/([\w-]+)(?:\.html)?\/?$/i);
        if (home) {
            return `https://mall.jd.com/index-${home[1]}.html`;
        }
        const shopId = numericQuery(url, 'shopId') || numericQuery(url, 'id');
        return shopId ? `https://mall.jd.com/index-${shopId}.html` : null;
    };

    /** 淘宝/天猫：query id 或 path i{id}.htm，保留 skuId */
    const taobaoLikeItem = (hosts, pcBase) => (url) => {
        if (!hosts.has(url.hostname)) {
            return null;
        }
        let id = numericQuery(url, 'id');
        if (!id) {
            const pathId = url.pathname.match(/\/i(\d+)\.htm$/i);
            id = pathId ? pathId[1] : null;
        }
        if (!id) {
            return null;
        }
        const pathOk =
            /\/item\.htm$/i.test(url.pathname) ||
            /\/awp\/core\/detail\.htm$/i.test(url.pathname) ||
            /\/i\d+\.htm$/i.test(url.pathname);
        if (!pathOk) {
            return null;
        }
        return copyParams(`${pcBase}?id=${id}`, url, ['skuId']);
    };

    const DOUBAN_SUBJECT = {
        movie: 'https://movie.douban.com',
        book: 'https://book.douban.com',
        music: 'https://music.douban.com'
    };

    /** @type {RuleFn[]} */
    const RULES = [
        // —— 电商 ——
        jdItemM,
        jdAltProduct,
        jdShop,
        whenHostPath('re.jd.com', /^\/cps\/item\/(\d+)\.html$/i, (m) => `https://item.jd.com/${m[1]}.html`),
        taobaoLikeItem(new Set(['detail.m.tmall.com', 'm.tmall.com']), 'https://detail.tmall.com/item.htm'),
        taobaoLikeItem(new Set(['h5.m.taobao.com', 'm.intl.taobao.com']), 'https://item.taobao.com/item.htm'),
        (url) => {
            if (!/^(?:www|smile)\.amazon\./i.test(url.hostname)) {
                return null;
            }
            const m = url.pathname.match(
                /(?:^|\/)(?:-\/[a-zA-Z0-9_-]+\/)?gp\/aw\/(?:d|dp|product)\/([A-Z0-9]{10})(?:\/|$)/i
            );
            return m ? `https://${url.hostname}/dp/${m[1]}` : null;
        },
        whenHostPath(
            'm.aliexpress.com',
            /^\/(item\/\d+\.html|store\/\d+)\/?$/i,
            (m) => `https://www.aliexpress.com/${m[1]}`
        ),
        (url) => {
            const mHost = url.hostname.match(/^(post\.)?m\.smzdm\.com$/i);
            if (!mHost) {
                return null;
            }
            const mPath = url.pathname.match(/^\/(p\/\d+)\/?$/i);
            if (!mPath) {
                return null;
            }
            return `https://${mHost[1] || ''}smzdm.com/${mPath[1]}/`;
        },

        // —— 社交 ——
        rehost('m.facebook.com', 'https://www.facebook.com'),
        rehost('mobile.twitter.com', 'https://x.com'),
        whenHostPath(
            'm.weibo.cn',
            /^\/(?:status|detail)\/([a-zA-Z0-9]+)\/?$/i,
            (m) => `https://weibo.com/detail/${m[1]}`
        ),
        whenHostPath('m.weibo.cn', /^\/(?:u|profile)\/(\d+)\/?$/i, (m) => `https://weibo.com/u/${m[1]}`),
        whenHostPath(
            'm.zhihu.com',
            /^\/(question\/\d+(?:\/answer\/\d+)?)\/?$/i,
            (m) => `https://www.zhihu.com/${m[1]}`
        ),
        whenHostPath('m.zhihu.com', /^\/p\/(\d+)\/?$/i, (m) => `https://zhuanlan.zhihu.com/p/${m[1]}`),

        // —— 论坛 / 中间页（部分整站换域） ——
        rehost((h) => /^mzh\.moegirl\.org\.cn(?:\.cc)?$/i.test(h), 'https://zh.moegirl.org.cn'),
        whenHostPath('jump2.bdimg.com', /^\/p\/(\d+)\/?$/i, (m) => `https://tieba.baidu.com/p/${m[1]}`),
        (url) => {
            if (url.hostname !== 'm.hupu.com') {
                return null;
            }
            if (url.pathname.startsWith('/bbs/')) {
                return `https://bbs.hupu.com/${url.pathname.slice(5)}${url.search}${url.hash}`;
            }
            if (url.pathname === '/zone' || url.pathname.startsWith('/zone/')) {
                return `https://bbs.hupu.com${url.pathname}${url.search}${url.hash}`;
            }
            return null;
        },
        rehost((h) => /^(?:ngabbs\.com|nga\.178\.com|yues\.org)$/i.test(h), 'https://bbs.nga.cn'),
        (url) => {
            if (!/^(?:bgm\.tv|bangumi\.tv|chii\.in)$/i.test(url.hostname)) {
                return null;
            }
            if (url.pathname !== '/m' && !url.pathname.startsWith('/m/')) {
                return null;
            }
            // 统一到桌面时间线入口
            return 'https://bgm.tv/rakuen';
        },

        // —— 内容 ——
        (url) => {
            if (!/^(?:m|www)\.bilibili\.com$/i.test(url.hostname)) {
                return null;
            }
            const m = url.pathname.match(/^\/(?:mobile\/)?video\/(av\d+|[Bb][Vv][a-zA-Z0-9]+)\/?$/i);
            if (!m) {
                return null;
            }
            return copyParams(`https://www.bilibili.com/video/${m[1]}/`, url, ['p', 't']);
        },
        whenHostPath(
            'm.bilibili.com',
            /^\/bangumi\/play\/((?:ep|ss)\d+)\/?$/i,
            (m) => `https://www.bilibili.com/bangumi/play/${m[1]}`
        ),
        (url) => {
            if (url.hostname !== 'www.bilibili.com' || !url.pathname.startsWith('/s/')) {
                return null;
            }
            return `https://www.bilibili.com/${url.pathname.slice(3)}${url.search}${url.hash}`;
        },
        (url) => {
            const m = url.hostname.match(
                /^([a-z-]+)\.m\.(wikipedia|wiktionary|wikibooks|wikinews|wikisource|wikiversity|wikivoyage|wikiquote)\.org$/i
            );
            if (!m) {
                return null;
            }
            return `https://${m[1]}.${m[2]}.org${url.pathname}${url.search}${url.hash}`;
        },
        rehost('m.wikidata.org', 'https://www.wikidata.org'),
        rehost('m.mediawiki.org', 'https://www.mediawiki.org'),
        (url) => {
            if (url.hostname !== 'm.douban.com') {
                return null;
            }
            const m = url.pathname.match(/^\/(movie|book|music)\/subject\/(\d+)\/?$/i);
            if (!m) {
                return null;
            }
            const origin = DOUBAN_SUBJECT[m[1].toLowerCase()];
            return origin ? `${origin}/subject/${m[2]}/` : null;
        },
        rehost('m.wikihow.com', 'https://www.wikihow.com'),
        whenHostPath('m.juejin.cn', /^\/post\/(\d+)\/?$/i, (m) => `https://juejin.cn/post/${m[1]}`),
        whenHostPath(
            'm.blog.csdn.net',
            /^\/([^/]+)\/article\/details\/(\d+)\/?$/i,
            (m) => `https://blog.csdn.net/${m[1]}/article/details/${m[2]}`
        )
    ];

    /** @param {string} href @returns {string|null} */
    const getRedirectUrl = (href) => {
        let url;
        try {
            url = new URL(href);
        } catch (_) {
            return null;
        }

        for (const to of RULES) {
            const next = to(url);
            if (typeof next !== 'string' || !next) {
                continue;
            }
            let abs;
            try {
                abs = new URL(next, url);
            } catch (_) {
                continue;
            }
            if (abs.href !== url.href) {
                return abs.href;
            }
        }
        return null;
    };

    const isRedirectLoop = (currentUrl) => {
        try {
            const lastSrc = sessionStorage.getItem(REDIRECT_GUARD_KEY);
            const lastTs = Number(sessionStorage.getItem(REDIRECT_GUARD_TS_KEY) || 0);
            if (lastSrc === currentUrl && Date.now() - lastTs < REDIRECT_GUARD_MS) {
                return true;
            }
        } catch (_) {
            /* ignore */
        }
        return false;
    };

    const markRedirect = (currentUrl) => {
        try {
            sessionStorage.setItem(REDIRECT_GUARD_KEY, currentUrl);
            sessionStorage.setItem(REDIRECT_GUARD_TS_KEY, String(Date.now()));
        } catch (_) {
            /* ignore */
        }
    };

    try {
        const currentUrl = window.location.href;
        if (isRedirectLoop(currentUrl)) {
            console.warn('M2PC：检测到可能的重定向循环，已中止。', currentUrl);
            return;
        }
        const target = getRedirectUrl(currentUrl);
        if (target) {
            markRedirect(currentUrl);
            window.location.replace(target);
        }
    } catch (e) {
        console.error('移动版到PC版URL转换脚本失败：', e);
    }
})();
