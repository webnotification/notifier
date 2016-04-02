import { Router } from 'express';
import Controller from '../controllers/analytics';

let router = new Router();

router.get('/notification', Controller.notification);
router.get('/permission',   Controller.permission);

export default router;
