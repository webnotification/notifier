import { Router } from 'express';
import Controller from '../controllers/user';

let router = new Router();

router.post('/register', Controller.create);
router.get('/details', Controller.details);
router.get('/image', Controller.image);

export default router;
