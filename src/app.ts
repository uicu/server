import path from'path';
import Koa from 'koa';
import cors from 'koa2-cors';
import json from 'koa-json';
import logger from 'koa-logger';
import koaStatic from 'koa-static';
import error from 'koa-json-error';
import koaBody from 'koa-body';
import parameter from 'koa-parameter';
import mongoose from 'mongoose';
import _  from 'lodash';
import views  from 'koa-views';
import sslify from 'koa-sslify';
import config from  './modules/config';
import routing from './routes/index';

const app = new Koa();

// 使用 ssl
app.use(sslify());

// 跨域
app.use(cors({
  origin: (ctx) => {
    return ctx.header.origin;
  }
}));

// 返回以json格式输出
app.use(json());

// 输出请求日志的功能
app.use(logger());

// 设置模板目录并指定模板引擎
app.use(views(path.join(__dirname, './views'), {
  extension: 'ejs',
}));

// 静态资源文件夹
app.use(koaStatic(path.join( __dirname, './public')));
app.use(koaStatic(path.join( __dirname, './uploads')));

// 返回json格式且易读的错误提示是有必要的
app.use(error({
  postFormat: (e, obj) => process.env.NODE_ENV === 'production' ? _.omit(obj, 'stack') : obj
}));

// 参数校验
app.use(parameter(app));

// 可以实现文件上传，同时也可以让koa能获取post请求的参数
app.use(koaBody({
  multipart: true, // 支持 multipart-formdate 的表单，意思就是支持文件上传(文件的Content-Type就叫multipart-formdate)
  formidable: { // koa-body集成了formidable包
  uploadDir: path.join(__dirname, config.upload_path),
  keepExtensions: true // 保留拓展名
  },
  formLimit: '10mb',
  jsonLimit: '10mb',
  textLimit: '10mb',
}));

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

routing(app);

// 数据库的连接

async function main() {
  const { host, user, password, database, port} = config.db;
  await mongoose.connect(`mongodb://${user}:${password}@${host}:${port}/${database}?authSource=admin`, { autoIndex: false });
}
main().catch(err => console.error(err));

export default app;
