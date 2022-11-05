import Router from 'koa-router';
import Topics from '../controllers/topics';
import Auth, { ScopeType } from '../modules/auth';
const router = new Router({ prefix: '/api/topics' });

const {
  create,
  update,
  checkTopicExist
} = Topics;

router.post('/', new Auth(ScopeType.ADMIN).m, create);
router.patch('/:id', new Auth(ScopeType.ADMIN).m, checkTopicExist, update);

export default router;