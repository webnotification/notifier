import {Router}   from 'express';
import userRouter from './users';
import groupRouter from './group';
import analyticsRouter from './analytics';
import notificationRouter from './notification';
import permissionRouter from './permission';
import imageRouter from './image';

let router = new Router();


router.use('/user', userRouter);
router.use('/group', groupRouter);
router.use('/analytics', analyticsRouter);
router.use('/notification', notificationRouter);
router.use('/permission', permissionRouter);
router.use('/image', imageRouter);


export default router;
