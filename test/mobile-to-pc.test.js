const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const source = fs.readFileSync(path.join(root, "mobile-to-pc.js"), "utf8");
const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");
const changelog = fs.readFileSync(path.join(root, "CHANGELOG.md"), "utf8");

const DESKTOP_UA =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const IPHONE_UA =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const IPAD_DESKTOP_UA =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";

/** Run the userscript against one URL and return every location.replace argument. */
function redirectFor(href, { ua = DESKTOP_UA, maxTouchPoints = 0 } = {}) {
    const calls = [];
    const sandbox = {
        URL,
        navigator: { userAgent: ua, maxTouchPoints },
        location: {
            href,
            replace(next) {
                calls.push(String(next));
            }
        },
        console
    };
    vm.runInNewContext(source, sandbox, { filename: "mobile-to-pc.js" });
    return calls;
}

const REDIRECT_CASES = [
    ["SMZDM alpha post", "https://m.smzdm.com/p/a6z40v7e/", "https://post.smzdm.com/p/a6z40v7e/"],
    ["SMZDM numeric deal", "https://m.smzdm.com/p/186002780/", "https://www.smzdm.com/p/186002780/"],
    ["Hupu zone", "https://m.hupu.com/zone/204?x=1", "https://bbs.hupu.com/204?x=1"],
    ["Hupu zone root", "https://m.hupu.com/zone", "https://bbs.hupu.com/"],
    ["Hupu bbs", "https://m.hupu.com/bbs/643892970.html?pn=1", "https://bbs.hupu.com/643892970.html?pn=1"],
    ["Bangumi subject", "https://bgm.tv/m/subject/123?x=1#y", "https://bgm.tv/subject/123?x=1#y"],
    ["Bangumi root", "https://bgm.tv/m/", "https://bgm.tv/rakuen"],
    ["Bangumi exact root", "https://bgm.tv/m", "https://bgm.tv/rakuen"],
    ["Bangumi alias", "https://bangumi.tv/m/subject/123", "https://bgm.tv/subject/123"],
    [
        "Bangumi group topic",
        "https://bgm.tv/m/topic/group/475715?x=1#y",
        "https://bgm.tv/group/topic/475715?x=1#y"
    ],
    ["Bangumi subject topic", "https://bgm.tv/m/topic/subject/41488", "https://bgm.tv/subject/topic/41488"],
    ["Bangumi ep topic", "https://bgm.tv/m/topic/ep/668419", "https://bgm.tv/ep/668419"],
    ["Bangumi person topic", "https://bgm.tv/m/topic/prsn/3223", "https://bgm.tv/person/3223"],
    ["Bangumi character topic", "https://bgm.tv/m/topic/crt/36543", "https://bgm.tv/character/36543"],
    [
        "京东商品",
        "https://item.m.jd.com/product/100012043978.html",
        "https://item.jd.com/100012043978.html"
    ],
    [
        "京东 wareId",
        "https://item.m.jd.com/ware/view.action?wareId=100012043978",
        "https://item.jd.com/100012043978.html"
    ],
    ["京东店铺", "https://shop.m.jd.com/shop/home/1000004123", "https://mall.jd.com/index-1000004123.html"],
    ["京东店铺参数", "https://shop.m.jd.com/?shopId=123", "https://mall.jd.com/index-123.html"],
    [
        "淘宝 h5 skuId",
        "https://h5.m.taobao.com/awp/core/detail.htm?id=123&skuId=456",
        "https://item.taobao.com/item.htm?id=123&skuId=456"
    ],
    ["天猫商品", "https://m.tmall.com/item.htm?id=123", "https://detail.tmall.com/item.htm?id=123"],
    [
        "天猫 i 路径",
        "https://m.tmall.com/i123.htm",
        "https://detail.tmall.com/item.htm?id=123"
    ],
    [
        "淘宝国际 skuId",
        "https://m.intl.taobao.com/detail/detail.html?id=123&skuId=456",
        "https://item.taobao.com/item.htm?id=123&skuId=456"
    ],
    ["Tieba query", "https://jump2.bdimg.com/p/643892970?pn=2", "https://tieba.baidu.com/p/643892970?pn=2"],
    ["IT之家", "https://m.ithome.com/html/1026676.htm", "https://www.ithome.com/0/102/6676.htm"],
    ["网易", "https://m.163.com/dy/article/I7LRA8AU051487S2.html", "https://www.163.com/dy/article/I7LRA8AU051487S2.html"],
    ["微博状态", "https://m.weibo.cn/detail/5362213345036831", "https://weibo.com/detail/5362213345036831"],
    ["微博用户", "https://m.weibo.cn/u/3612749480", "https://weibo.com/u/3612749480"],
    [
        "淘宝 skuId",
        "https://detail.m.tmall.com/item.htm?id=123&skuId=456",
        "https://detail.tmall.com/item.htm?id=123&skuId=456"
    ],
    [
        "B站 legacy",
        "https://www.bilibili.com/mobile/video/BV1xx411c7mD?p=2&t=30",
        "https://www.bilibili.com/video/BV1xx411c7mD/?p=2&t=30"
    ],
    ["Amazon", "https://www.amazon.co.jp/gp/aw/d/B08N5WRWNW/ref=x", "https://www.amazon.co.jp/dp/B08N5WRWNW"],
    ["萌百", "https://mzh.moegirl.org.cn/Mainpage", "https://zh.moegirl.org.cn/Mainpage"],
    ["NGA", "https://ngabbs.com/read.php?tid=123", "https://bbs.nga.cn/read.php?tid=123"],
    ["豆瓣", "https://m.douban.com/movie/subject/1292052", "https://movie.douban.com/subject/1292052/"],
    [
        "AliExpress",
        "https://m.aliexpress.com/item/1005001234567890.html",
        "https://www.aliexpress.com/item/1005001234567890.html"
    ],
    ["腾讯新闻", "https://view.inews.qq.com/a/20231113A0ABCD00", "https://news.qq.com/rain/a/20231113A0ABCD00"],
    ["虎嗅", "https://m.huxiu.com/article/4905349.html", "https://www.huxiu.com/article/4905349.html"],
    ["澎湃", "https://m.thepaper.cn/newsDetail_forward_123", "https://www.thepaper.cn/newsDetail_forward_123"],
    ["搜狐", "https://m.sohu.com/a/123_456", "https://www.sohu.com/a/123_456"]
];

for (const [name, input, expected] of REDIRECT_CASES) {
    test(`redirects ${name}`, () => {
        assert.deepEqual(redirectFor(input), [expected]);
    });

    test(`${name} does not redirect twice`, () => {
        assert.deepEqual(redirectFor(expected), []);
    });
}

const REMOVED_HOSTS = [
    "m.bilibili.com",
    "m.zhihu.com",
    "m.blog.csdn.net",
    "m.wikihow.com",
    "m.facebook.com",
    "m.mediawiki.org",
    "m.wikidata.org",
    "nga.178.com",
    "3g.163.com",
    "mobile.twitter.com",
    "m.toutiao.com",
    "m.yiyaojd.com",
    "post.m.smzdm.com",
    "m.juejin.cn",
    "mzh.moegirl.org.cn.cc",
    "m.jd.hk",
    "mitem.jd.com",
    "wqitem.jd.com",
    "m.36kr.com",
    "re.jd.com"
];

test("removed hosts are not redirected", () => {
    for (const host of REMOVED_HOSTS) {
        assert.deepEqual(redirectFor(`https://${host}/`), [], `${host} should not be in BY_HOST`);
    }
});

test("removed hosts are absent from the script", () => {
    for (const host of REMOVED_HOSTS) {
        assert.ok(!source.includes(host), `${host} should be removed from the script`);
    }
});

test("mobile UA is left alone", () => {
    assert.deepEqual(redirectFor("https://m.ithome.com/html/1026676.htm", { ua: IPHONE_UA }), []);
});

test("iPadOS desktop UA is left alone", () => {
    assert.deepEqual(
        redirectFor("https://m.ithome.com/html/1026676.htm", { ua: IPAD_DESKTOP_UA, maxTouchPoints: 5 }),
        []
    );
});

test("real Mac desktop UA still redirects", () => {
    assert.deepEqual(redirectFor("https://m.ithome.com/html/1026676.htm", { ua: IPAD_DESKTOP_UA }), [
        "https://www.ithome.com/0/102/6676.htm"
    ]);
});

test("unknown Bangumi topic kind is left alone", () => {
    assert.deepEqual(redirectFor("https://bgm.tv/m/topic/blog/1"), []);
});

test("non-numeric JD shop path is left alone", () => {
    assert.deepEqual(redirectFor("https://shop.m.jd.com/shop/home/abc123"), []);
});

test("required scoped @match patterns exist", () => {
    const lines = [...source.matchAll(/^\/\/ @match\s+(.+)$/gm)].map((m) => m[1].trim());
    for (const pattern of [
        "*://bgm.tv/m",
        "*://bangumi.tv/m",
        "*://chii.in/m",
        "*://www.bilibili.com/mobile/video/*"
    ]) {
        assert.ok(lines.includes(pattern), `missing @match ${pattern}`);
    }
});

test("@match list matches BY_HOST", () => {
    const matchLines = [...source.matchAll(/^\/\/ @match\s+(.+)$/gm)].map((m) => m[1].trim());
    const matches = matchLines.map((line) => line.match(/^\*:\/\/([^/]+)\//)[1]);
    const literalKeys = [...source.matchAll(/^\s{8}'([^']+)':/gm)].map((m) => m[1]);
    const amazonBlock = source.match(/for \(const h of \[([\s\S]*?)\]\)/)[1];
    const amazonKeys = [...amazonBlock.matchAll(/'([^']+)'/g)].map((m) => m[1]);

    assert.equal(new Set(matchLines).size, matchLines.length, "@match contains duplicate lines");
    assert.deepEqual(
        [...new Set(matches)].sort(),
        [...new Set([...literalKeys, ...amazonKeys])].sort()
    );
});

test("version is consistent across script, README and CHANGELOG", () => {
    const version = source.match(/@version\s+(\S+)/)[1];
    const badge = readme.match(/badge\/version-([0-9.]+)-/)[1];
    const latest = changelog.match(/^## \[([0-9.]+)\]/m)[1];

    assert.equal(version, badge);
    assert.equal(version, latest);
});
