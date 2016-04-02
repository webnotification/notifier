import { Router } from 'express';
import Controller from '../controllers/permission';

let router = new Router();

router.post('/send', Controller.send);

export default router;
