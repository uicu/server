import Koa from 'koa';
class Base {
  index(ctx: Koa.Context) {
    ctx.body = 'Api Server！';
  }
  error(ctx: Koa.Context) {
    ctx.throw(412, '先决条件失败：id大于数据长度');
  }
}

export default new Base();
