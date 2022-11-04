import Koa from 'koa';
import parser from 'ua-parser-js';

export default async (ctx: Koa.Context, next: Koa.Next) => {
    const ua = ctx.headers['user-agent'];
    let uaParser = new parser(ua);
    // 自己检查一些不常用的浏览器
    if (/99Browser/.test(ua)) { // 久久浏览器
        const myOwnRegex = [[ /(99Browser)\/([\w\.]+)/i ], [ parser.BROWSER.NAME, parser.BROWSER.VERSION ]];
        const myParser = new parser({ 'browser': myOwnRegex });
        uaParser = myParser.setUA(ua);
    } else if (/LieBaoFast/.test(ua)) { // 猎豹浏览器
        const myOwnRegex = [[ /(LieBaoFast)\/([\w\.]+)/i ], [ parser.BROWSER.NAME, parser.BROWSER.VERSION ]];
        const myParser = new parser({ 'browser': myOwnRegex });
        uaParser = myParser.setUA(ua);
    } else if (/2345Browser/.test(ua)) { // 2345浏览器
        const myOwnRegex = [[ /(2345Browser)\/([\w\.]+)/i ], [ parser.BROWSER.NAME, parser.BROWSER.VERSION ]];
        const myParser = new parser({ 'browser': myOwnRegex });
        uaParser = myParser.setUA(ua);
    } else if (/SogouMobileBrowser/.test(ua)) { // 搜狗浏览器
        const myOwnRegex = [[ /(SogouMobileBrowser)\/([\w\.]+)/i ], [ parser.BROWSER.NAME, parser.BROWSER.VERSION ]];
        const myParser = new parser({ 'browser': myOwnRegex });
        uaParser = myParser.setUA(ua);
    } else if (/MZBrowser/.test(ua)) { // 魅族浏览器
        const myOwnRegex = [[ /(MZBrowser)\/([\w\.]+)/i ], [ parser.BROWSER.NAME, parser.BROWSER.VERSION ]];
        const myParser = new parser({ 'browser': myOwnRegex });
        uaParser = myParser.setUA(ua);
    }

    const clientType = uaParser.getResult();

    const getBrowser = uaParser.getBrowser();
    const browserName = getBrowser.name || 'unknown'; // 浏览器名称
    const browserVersion = getBrowser.version; // 浏览器版本

    const getOS = uaParser.getOS();
    const osName = getOS.name || 'unknown'; // 操作系统名称
    const osVersion = getOS.version; // 操作系统版本

    const getDevice = uaParser.getDevice();
    const platformType = getDevice.type || 'desktop'; // 判断是什么平台

    const getEngine = uaParser.getEngine();
    const engineName = getEngine.name || 'unknown'; // 判断是什么引擎

    ctx.state.ua = {
        clientType,
        browserName,
        browserVersion,
        osName,
        osVersion,
        platformType,
        engineName
    };
    await next();
};