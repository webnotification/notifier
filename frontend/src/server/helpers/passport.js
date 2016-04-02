import passport from 'passport';
import mongoose from 'mongoose';

import User from '../models/user';
// Use our authetication strategy
passport.use(User.createStrategy());

// Provide methods to retain user between sessions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

export default passport;
