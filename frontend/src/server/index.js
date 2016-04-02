import 'babel-polyfill';
import _     from 'lodash';
import fs    from 'fs';
import path  from 'path';
import express  from 'express';
import React    from 'react';
import favicon  from 'serve-favicon';
import winston  from 'winston';
import compress from 'compression';
import cookieParser  from 'cookie-parser';
import bodyParser    from 'body-parser';
import morgan from 'morgan';
import session from 'express-session';
import PrettyError from 'pretty-error';

import DBConnect from './db';

import passport from './helpers/passport';
import config from './config/server';
import errlog from './helpers/logger';
import router from './router';



/**
 * Constants
 */

const isProduction = process.env.NODE_ENV === 'production' ? true : false;
const errorlog = errlog({
  errorFile : path.resolve(__dirname, './logs/error.log'),
  accessFile: path.resolve(__dirname, './logs/access.log')
});
const pe = new PrettyError();

// Pretty Error Options
pe.skipNodeFiles();
pe.skipPackage('express', 'react');
pe.withoutColors();






/**
 * Server Setup
 */

let server = express();
server.set('env', isProduction ? 'production': 'development');

// Dev Mode
if (!isProduction) {
  server.locals.pretty = true;
}

server.set('views', path.join(__dirname, 'templates'));
server.set('view engine', 'jade');

server.use(compress());
server.use(favicon(__dirname + '/public/favicon.ico'));
server.use(cookieParser());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: false}));
server.use(morgan('dev'));

/**
 * Session
 */
server.use(session({
  secret: config.session.secret,
  saveUninitialized: true,
  resave: false
}));
server.use(passport.initialize());
server.use(passport.session());



/**
 * Serving
 */

// Static Assets
server.use(express.static(__dirname +'/public'));

// Attach Router
router(server);



/**
 * 404
 */
server.use((req, res, next)=>{
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});


/**
 * Error Handler
 */
server.use((err, req, res, next)=> {
  let _err = pe.render(err);
  res.status(err.status || 500);
  res.render('error', { message: err.message, error: (isProduction ? {} : _err) });
  errorlog.error('Server Error: ', err);
});





let runServer = (status)=> {
  server.listen(server.get('port'), ()=> {
    if (process.send){ process.send('online') };
    console.log('The server is running at http://localhost:' + server.get('port'));
  })
};


// Launch the server
server.set('port', (process.env.PORT || 5000));

DBConnect()
  .then(runServer)
  .catch( err => {
    console.log('Server Failed');
    console.error(err);
    throw err;
  });
