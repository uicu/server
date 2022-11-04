import path from 'path';
import glob from 'glob'; // 获取匹配规则的所有文件

const route = (app: any) => {
  try {
    glob.sync(path.resolve(__dirname, process.env.NODE_ENV === 'development' ? './**/!(index).ts' : './**/!(index).js')).forEach((file: string) => {
      const router = require(file);
      app.use(router.default.routes());
      app.use(router.default.allowedMethods());
    });
  } catch (err) {
    console.log(err);
  }
};

export default route;