import Koa from 'koa';

class Base {
  async test(ctx: Koa.Context) {
    console.log( ctx.state.ua);
    const title = 'hello koa2';
    await ctx.render('email/code', {
      name: 'ooyang',
      code: 1234,
      productName: 'productName',
      domain: 'domain',
      companyName: 'companyName'
    });
  }
}

export default new Base();
