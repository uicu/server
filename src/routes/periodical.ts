import Router from 'koa-router';
import Auth, { ScopeType } from '../modules/auth';
import Periodical from '../controllers/periodical';
const router = new Router({ prefix: '/api/periodical'});

const {
  find,
  findById,
  create,
  update,
  checkPeriodicalExist,
  delete: del,
} = Periodical;

router.get('/', find);
router.post('/', new Auth(ScopeType.ADMIN).m, create);
router.get('/:id', checkPeriodicalExist, findById);
router.patch('/:id', new Auth(ScopeType.ADMIN).m, checkPeriodicalExist, update);
router.delete('/:id', new Auth(ScopeType.SUPER_ADMIN).m, checkPeriodicalExist, del);

export default router;