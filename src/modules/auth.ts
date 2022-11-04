import Koa from 'koa';
import jwt from 'jsonwebtoken';
import redisStore from 'koa-redis';
import config from  './config';

const { secret, redisStoreKey } = config;
const Store = redisStore({}).client;

export enum ScopeType {
  /** 普通用户 */
  USER = 32,
  /** 管理员 */
  ADMIN = 64,
  /** 超级管理员 */
  SUPER_ADMIN = 128,
}

export interface UserType {
   _id: string;
   name: string;
   scope: number;
}

export default class Auth {
  level: number;
  constructor(level = ScopeType.USER) {
    this.level = level;
  }
  get m() {
    return async(ctx: Koa.Context, next: Koa.Next) => {
        const { authorization } = ctx.request.header;
        if (!authorization) {
          ctx.throw(403, '需要在header上的字段authorization携带token');
        }
        const token: string = authorization.replace('Bearer ', '');
        let user: UserType;
        try {
          user = jwt.verify(token, secret) as UserType;
        } catch (err) {
          // 401 未认证（err.name 等于 'TokenExpiredError' 是token已过期）
          ctx.throw(401, 'token有问题');
        }
        // Token副本校验，在redis中存储token副本，用户请求时候校验，如果redis中不存在该副本则不给通过。
        const storeUserId = await Store.hget(`${redisStoreKey.usertoken}:${user._id}`, 'id');
        if (!storeUserId || storeUserId !== user._id) {
          ctx.throw(403, '当前用户登陆不合法');
        }
        if (user.scope < this.level) {
          ctx.throw(403, '权限不足');
        }
        ctx.state.user = user;

      await next();
    };
  }
}
