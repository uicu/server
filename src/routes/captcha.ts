import Router from 'koa-router';
import Captcha from '../controllers/captcha';

const router = new Router({ prefix: '/api/captcha'});

const { index } = Captcha;
router.get('/', index);

export default router;
