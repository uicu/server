import Router from 'koa-router';
import Test from '../controllers/test';
import ua from '../modules/ua';

const router = new Router({
  prefix: '/api/test'
});

const { test } = Test;
router.get('/', ua, test);

export default router;
