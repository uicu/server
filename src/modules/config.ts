class ModuleConfig {
    /** 端口号 */
    public readonly port = 3000;
    /** 端口号 */
    public readonly domain = process.env.NODE_ENV === 'production' ? 'http://uicu.club/' : 'http://localhost:3000/';
    /** 数据库配置 */
    public readonly db = {
        host: 'localhost',
        user: 'okevin',
        password: '123456',
        /** 数据库名 */
        database: 'recommended',
        port: 27017,
    };
    /** 上传图片存放目录 */
    public readonly upload_path = '/public/uploads';
    /** 上传图片大小限制 */
    public readonly upload_img_size = 5 * 1024 * 1024;
    // formData.append('img', file)
    /** 前端上传图片时约定的字段 */
    public readonly upload_img_name = 'img';
    /** 用户临时表 */
    public readonly user_file = 'public/user.json';
    /** token 长度 */
    public readonly token_size = 28;
    /** 邮件验证服务  */
    public readonly smtp = {
        host: 'smtp.qq.com',
        user: '292222369@qq.com',
        password: 'ptzculhpeumcbgci',
        code: () => {
            return Math.random().toString(16).slice(2, 6).toUpperCase();
        },
        expire: () => {
            return new Date().getTime() + 60 * 1000;
        }
    };
    /** token有效时长  */
    public readonly loginExpire =  1000 * 60 * 60 * 24 * 7;
    /** secret  */
    public readonly secret = 'uicu-jwt-secret';
    /** redis store key  */
    public readonly redisStoreKey = {
        nodemail: 'nodemail',
        usertoken: 'usertoken',
        captcha: 'captcha',
        passwordReset: 'passwordReset'

    };
}
/** 项目配置 */
export default new ModuleConfig();