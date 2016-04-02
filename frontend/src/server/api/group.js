import { Router } from 'express';
import Controller from '../controllers/group';

let router = new Router();

router.get('/list', Controller.list);
router.post('/create', Controller.create);

export default router;
