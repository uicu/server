import Router from 'koa-router';
import Contact from '../controllers/contact';

const router = new Router({
    prefix: '/api/contact'
});

const { create } = Contact;

router.post('/', create);

export default router;
