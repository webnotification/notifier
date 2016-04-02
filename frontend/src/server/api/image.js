import { Router } from 'express';
import Controller from '../controllers/image';

let router = new Router();

router.post('/upload', Controller.upload);

export default router;
