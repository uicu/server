import Koa from 'koa';
class Home {
    async index(ctx: Koa.Context) {
        const title = '首页';
        const description = '首页';
        await ctx.render('home/index', {
            title,
            description
        });
    }
    async about(ctx: Koa.Context) {
        const title = '关于我';
        const description = 'description';
        await ctx.render('home/about', {
            title,
            description
        });
    }
    async contact(ctx: Koa.Context) {
        const title = '联系我';
        const description = 'description';
        await ctx.render('home/contact', {
            title,
            description
        });
    }
    async detail(ctx: Koa.Context) {
        const title = '详情';
        const description = 'description';
        await ctx.render('home/detail', {
            title,
            description
        });
    }
    help(ctx: Koa.Context) {
        ctx.body = 'help!';
    }
    passwordResetEmail(ctx: Koa.Context) {
        ctx.body = 'password reset email!';
    }
    passwordReset(ctx: Koa.Context) {
        const { code } = ctx.params;
        ctx.body = `password reset code: ${code}`;
    }
    login(ctx: Koa.Context) {
        ctx.body = 'login!';
    }
}

export default new Home();
