import Koa from 'koa';

class FilterCtl {
  async parameter (ctx: Koa.Context, next: Koa.Next) {
    const { del } = ctx.request.body;
    if (del || typeof del === 'boolean'  ) {
      delete ctx.request.body.del;
    }
    await next();
  }
  async softDelete (ctx: Koa.Context, next: Koa.Next) {
    ctx.request.body = {};
    ctx.request.body.del = true;
    await next();
  }
}
export default new FilterCtl();