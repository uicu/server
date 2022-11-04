import Koa from 'koa';
import jwt from 'jsonwebtoken';
import redisStore from 'koa-redis';
import stringRandom from 'string-random';
import User from '../models/users';
import { UserType } from '../modules/auth';
import {
    sendWelcomeMail,
    sendCodeMail,
    sendPasswordResetEmail,
    sendPasswordResetEmailHelp
} from '../modules/send-email/send';
import config from  '../modules/config';

const {
    smtp,
    loginExpire,
    secret,
    redisStoreKey,
    domain
} = config;

const Store = redisStore({}).client;
class UsersCtl {
    // 只能修改自己的用户信息，自己编写的授权，跟业务代码强相关，所以写在这里
    async checkOwner(ctx: Koa.Context, next: Koa.Next) {
        if (ctx.params.id !== ctx.state.user._id) {
            ctx.throw(403, '只能修改自己的');
        }
        await next();
    }

    // 检查用户存在与否，跟业务代码强相关，所以写在这里
    async checkUserExist(ctx: Koa.Context, next: Koa.Next) {
        const user = await User.findById(ctx.params.id).select('+del');
        if (!user) {
            ctx.throw(404, '用户不存在');
        }
        await next();
    }

    // 检查是否已经存在该用户名
    async whetherName(ctx: Koa.Context) {
        const { name } = ctx.query;
        const repeatedUser = await User.findOne({ name });
        ctx.body = !!repeatedUser;
    }

    // 检查是否已经存在该邮箱
     async whetherEmail(ctx: Koa.Context) {
        const { email } = ctx.query;
        const repeatedEmail = await User.findOne({ email });
        ctx.body = !!repeatedEmail;
    }

    // 邮箱发送code
    async verify(ctx: Koa.Context) {
        ctx.verifyParams({
            name: { type: 'string', required: true },
            email: { type: 'string', required: true }
        });
        const { name, email } = ctx.request.body;
        const saveExpire = await Store.hget(`${redisStoreKey.nodemail}:${name}`, 'expire');
        if (saveExpire && new Date().getTime() - saveExpire < 0) {
            ctx.body = {
                code: -1,
                msg: 'requests are too frequent' // 验证请求过于频繁 1分钟内1次
            };
            return;
        }
        const ko = {
            code: smtp.code(),
            expire: smtp.expire(),
        };
        await sendCodeMail({email, code: ko.code, name}).then(() => {
            Store.hmset(
                `${redisStoreKey.nodemail}:${name}`,
                'code',
                ko.code,
                'expire',
                ko.expire,
                'email',
                email
            );
            return ctx.body = 'The verification code has been sent, there may be a delay, the validity period is 1 minute';
        }).catch(() => {
            return ctx.body = 'Failed to send';
        });
    }

    // 创建用户
    async create(ctx: Koa.Context) {
        ctx.verifyParams({
            name: { type: 'string', required: true },
            password: { type: 'string', required: true },
            email: { type: 'email', required: true },
            code: { type: 'string', required: true }
        });
        const { name, password, email, code } = ctx.request.body;

        const saveCode = await Store.hget(`${redisStoreKey.nodemail}:${name}`, 'code');
        const saveExpire = await Store.hget(`${redisStoreKey.nodemail}:${name}`, 'expire');
        if (code === saveCode) {
            if (new Date().getTime() - saveExpire > 0) {
                ctx.throw(400, '验证码已过期，请重新尝试');
            } else {
                const repeatedUser = await User.findOne({ name });
                if (!!repeatedUser) {
                    ctx.throw(409, '用户已经存在');
                }
                const repeatedEmail = await User.findOne({ email });
                if (!!repeatedEmail) {
                    ctx.throw(409, '邮箱已经存在');
                }
                const user = await new User({ name, password, email }).save();
                ctx.body = user;
                // 发送欢迎邮件失败不要影响数据保存。
                sendWelcomeMail({email, name}).then(() => {
                    console.log('Welcome Email Send Success');
                }).catch(() => {
                    console.log('Welcome Email Send Fail');
                });
            }
        } else {
            ctx.throw(400, '请填写正确的验证码');
        }
    }

    // 用户列表
    async find(ctx: Koa.Context) {
        const { size = 10, current = 1 } = ctx.query;
        const page = Math.max((current as number) * 1, 1) - 1;
        const perPage = Math.max((size as number) * 1, 1);
        ctx.body = await User.find({ del: false}).limit(perPage).skip(page * perPage).sort({'updatedAt': -1});
    }

    // 根据某个用户id查找用户详情
    async findById(ctx: Koa.Context) {
        ctx.body = await User.findById(ctx.params.id);
    }

    // 登录
    async login(ctx: Koa.Context) {
        ctx.verifyParams({
          name: { type: 'string', required: true },
          password: { type: 'string', required: true }
        });
        const user = await User.findOne({ name: ctx.request.body.name }).select(
          '+password +scope +del'
        );
        if (!user || user.del) {
          ctx.throw(401, '用户不存在');
        }
        try {
          const pt = await user.comparePassword(
            ctx.request.body.password,
            user.password
          );
          if (pt) {
            const { _id, name, scope } = user;
            const token = jwt.sign({ _id, name , scope }, secret, {
              expiresIn: loginExpire
            });
            ctx.body = { token };
            Store.hmset(
                `${redisStoreKey.usertoken}:${_id}`,
                'name',
                name,
                'id',
                _id,
            );
          } else {
            ctx.throw(401, '密码错误');
          }
        } catch (err) {
          ctx.throw(401, err);
        }
    }

    // 登出
    async signout(ctx: Koa.Context) {
        const { authorization = '' } = ctx.request.header;
        if (!authorization) {
            return ctx.body = 'not token';
        }
        const token = authorization.replace('Bearer ', '');
        let user: UserType;
        try {
          user = jwt.verify(token, secret) as UserType;
        } catch (err) {
          // 登出时所携带清除的token有问题
          return ctx.body = 'Failed';
        }
        if (!!user) {
            await Store.del(`${redisStoreKey.usertoken}:${user._id}`);
        }
        ctx.body = 'Success';
    }

    // 硬删除
    async delete(ctx: Koa.Context) {
        const { id } = ctx.params;
        ctx.body = await User.findByIdAndRemove(id);
        if (!!id) {
            await Store.del(`${redisStoreKey.usertoken}:${id}`);
        }
    }

    // 注销用户（软删除）
    async logout(ctx: Koa.Context) {
        const { id } = ctx.params;
        ctx.body = await User.findByIdAndUpdate(id, { del: true });
        if (!!id) {
            await Store.del(`${redisStoreKey.usertoken}:${id}`);
        }
    }

    // 重置密码邮件
    async passwordResetEmail(ctx: Koa.Context) {
        ctx.verifyParams({
            email: { type: 'email', required: true }
        });
        const { email } = ctx.request.body;
        const resetUser = await User.findOne({ email });
        const { osName, browserName } = ctx.state.ua;
        if (!!resetUser) {
            // const saveExpire = await Store.hget(`${redisStoreKey.passwordReset}:${email}`, 'expire');
            // if (saveExpire && new Date().getTime() - saveExpire < 0) {
            //     ctx.body = {
            //         code: -1,
            //         msg: 'requests are too frequent' // 验证请求过于频繁
            //     };
            //     return;
            // }

            // 生成随机字符串
            const code = stringRandom(60);
            const expiration = Date.now() + 60 * 60 * 24 * 1000; // 24小时
            const { name, _id } = resetUser;
            const url = `${domain}password/reset/${code}`;
            await sendPasswordResetEmail({email, name, url, osName, browserName }).then(() => {
                Store.hmset(
                    `${redisStoreKey.passwordReset}:${code}`,
                    'email',
                    email,
                    'expire',
                    expiration,
                    'code',
                    code,
                    'name',
                    name,
                    'id',
                    _id
                );
                return ctx.body = 'Success';
            }).catch(() => {
                return ctx.body = 'Failed to send';
            });
        } else {
            // 邮箱不存在
            await sendPasswordResetEmailHelp({email, osName, browserName}).then(() => {
                ctx.body = '邮箱不存在，帮助邮件发送成功';
            }).catch(() => {
                ctx.body = '邮箱不存在，帮助邮件发送失败';
            });
        }
    }

    // 重置密码邮件验证code
    async passwordResetVerification(ctx: Koa.Context) {
        const { code } = ctx.params;
        const storePasswordReset = await Store.hgetall(`${redisStoreKey.passwordReset}:${code}`);
        if (storePasswordReset.code === code && Number(storePasswordReset.expire) >= Date.now()) {
            ctx.body = 'Success';
        } else {
            ctx.body = 'Failed';
        }
    }

    // 重置密码
    async passwordReset(ctx: Koa.Context) {
        ctx.verifyParams({
            name: { type: 'string', required: true },
            password: { type: 'string', required: true },
            password_confirmation: { type: 'string', required: true },
            code: { type: 'string', required: true }
        });
        const { name, password, password_confirmation, code } = ctx.request.body;
        if (password !== password_confirmation) {
            ctx.throw(409, '两次密码不一致，请重新输入');
        }
        const storePasswordReset = await Store.hgetall(`${redisStoreKey.passwordReset}:${code}`);
        if (
            name === storePasswordReset.name &&
            code === storePasswordReset.code &&
            Number(storePasswordReset.expire) >= Date.now() &&
            !!storePasswordReset.id
        ) {
            const user = await User.findById(storePasswordReset.id).select('+password');
            user.password = password;
            await user.save();
            // 修改密码后使登录太的token失效
            await Store.del(`${redisStoreKey.usertoken}:${storePasswordReset.id}`);
            //  修改密码后使code 失效
            await Store.del(`${redisStoreKey.passwordReset}:${code}`);
            ctx.body = user;
        } else {
            ctx.throw(409, '信息核验失败！');
        }
    }
}

export default new UsersCtl();