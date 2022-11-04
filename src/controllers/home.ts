import Koa from 'koa';
class Home {
    async index(ctx: Koa.Context) {
        const title = 'index';
        await ctx.render('home/index', {
            title
        });
    }
    async about(ctx: Koa.Context) {
        const title = 'about';
        await ctx.render('home/about', {
            title
        });
    }
    async contact(ctx: Koa.Context) {
        const title = 'contact';
        await ctx.render('home/contact', {
            title
        });
    }
    async detail(ctx: Koa.Context) {
        const title = 'detail';
        await ctx.render('home/detail', {
            title
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
