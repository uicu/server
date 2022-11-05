import Koa from 'koa';
import Periodical from '../models/periodical';

class PeriodicalCtl {
  async find(ctx: Koa.Context) {
    const { size = 10, current = 1 } = ctx.query;
    const page = Math.max((current as number) * 1, 1) - 1;
    const perPage = Math.max((size as number) * 1, 1);
    ctx.body = await Periodical.find({ del: false}).limit(perPage).skip(page * perPage).sort({'updatedAt': -1});
  }
  async checkPeriodicalExist(ctx: Koa.Context, next: Koa.Next) {
    const periodical = await Periodical.findById(ctx.params.id);
    if (!periodical) {
      ctx.throw(404, '期刊不存在');
    }
    ctx.state.periodical = periodical;
    await next();
  }
  async findById(ctx: Koa.Context) {
    // pv统计
    await Periodical.findByIdAndUpdate(ctx.params.id, { $inc: { pv: 1 } });
    ctx.body = await Periodical.findById(ctx.params.id);
  }
  async create(ctx: Koa.Context) {
    ctx.verifyParams({
        pic: { type: 'string', required: false },
        title: { type: 'string', required: true },
        describe: { type: 'string', required: true },
        author: { type: 'string', required: true },
        content: { type: 'string', required: true },
        topics: { type: 'array', required: true },
    });
    const periodical = await new Periodical({
      ...ctx.request.body,
    }).save();
    ctx.body = periodical;
  }
  async update(ctx: Koa.Context) {
    ctx.verifyParams({
        pic: { type: 'string', required: false },
        title: { type: 'string', required: true },
        describe: { type: 'string', required: true },
        author: { type: 'string', required: true },
        content: { type: 'string', required: true },
        topics: { type: 'array', required: true },
    });
    await ctx.state.periodical.update(ctx.request.body);
    ctx.body = ctx.state.periodical;
  }

  async delete(ctx: Koa.Context) {
    await Periodical.findByIdAndRemove(ctx.params.id);
    ctx.status = 204;
  }
}
export default new PeriodicalCtl();
