import Koa from 'koa';
import Contact from '../models/contact';

class ContactCtl {
  // 新增
  async create(ctx: Koa.Context) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      email: { type: 'email', required: true },
      phone: { type: 'string', required: true },
      content: { type: 'string', required: true }
    });
    const contact = await new Contact(ctx.request.body).save();
    ctx.body = contact;
  }
}
export default new ContactCtl();
