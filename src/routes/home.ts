import Router from 'koa-router';
import Home from '../controllers/home';

const router = new Router;
const {
    index,
    about,
    contact,
    detail,
    help,
    passwordResetEmail,
    login,
    passwordReset,
} = Home;

router.get('/', index);
router.get('/about', about);
router.get('/detail', detail);
router.get('/contact', contact);
router.get('/help', help);
router.get('/password/reset/email', passwordResetEmail);
router.get('/password/reset/:code', passwordReset);
router.get('/login', login);

export default router;
