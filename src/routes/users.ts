import Router from 'koa-router';
import Users from '../controllers/users';
import Auth, { ScopeType } from '../modules/auth';
import ua from '../modules/ua';

const router = new Router({ prefix: '/api/users'});

const {
    whetherEmail,
    whetherName,
    verify,
    create,
    find,
    findById,
    login,
    signout,
    delete: del,
    logout,
    checkUserExist,
    checkOwner,
    passwordResetEmail,
    passwordResetVerification,
    passwordReset
} = Users;

router.get('/', new Auth(ScopeType.ADMIN).m, find);
router.post('/', create);
router.get('/:id', findById);
router.get('/whether/name', whetherName);
router.get('/whether/email', whetherEmail);
router.post('/verify', verify);
router.post('/login', login);
router.post('/signout', signout);
router.delete('/:id', new Auth(ScopeType.SUPER_ADMIN).m, checkUserExist, del);
router.delete('/logout/:id', new Auth().m, checkUserExist, checkOwner, logout);
router.post('/password/reset/email', ua, passwordResetEmail);
router.get('/password/reset/:code', passwordResetVerification);
router.post('/password/reset', passwordReset);
export default router;