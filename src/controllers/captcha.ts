import Koa from 'koa';
import redisStore from 'koa-redis';
import captchaCode from '../modules/captcha';
import config from  '../modules/config';
import { getID } from '../lib/index';
const { redisStoreKey } = config;

const Store = redisStore({}).client;
class Captcha {
    index(ctx: Koa.Context) {
        const { expression = 'no' } = ctx.query;
        const { text, data } = captchaCode(expression === 'yes');
        const expire = new Date().getTime() + 60 * 1000; // 60s 后过期
        const  captchaId = getID(10);
        Store.hmset(
            `${redisStoreKey.captcha}:${captchaId}`,
            'text',
            text,
            'expire',
            expire,
        );
        // ctx.set('Content-Type', 'image/svg+xml');
        ctx.body = {
            svg: data,
            captchaId
        };
    }
}

export default new Captcha();
