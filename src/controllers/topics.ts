import Koa from 'koa';
import Topic from '../models/topics';

class TopicCtl {
  async checkTopicExist(ctx: Koa.Context, next: Koa.Next) {
    const topic = await Topic.findById(ctx.params.id);
    if (!topic) {
      ctx.throw(404, '话题不存在');
    }
    await next();
  }
  // 新增话题
  async create(ctx: Koa.Context) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      describe: { type: 'string', required: true }
    });
    const topic = await new Topic(ctx.request.body).save();
    ctx.body = topic;
  }
  // 修改话题
  async update(ctx: Koa.Context) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      describe: { type: 'string', required: true }
    });
    const topic = await Topic.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    if (!topic) {
      ctx.throw(404, '话题不存在');
    }
    ctx.body = topic; // topic是更新前的
  }
}
export default new TopicCtl();
