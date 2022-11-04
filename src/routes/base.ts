import Router from 'koa-router';
import Base from '../controllers/base';

const router = new Router({
  prefix: '/api'
});

const { index, error } = Base;
router.get('/', index);
router.get('/error', error);

export default router;
