import fs from 'fs';
import mongoose from 'mongoose';
import config from './config/database';

// Register all models
import models from './models';


var url = (process.env.NODE_ENV === 'production')
  ?  process.env.MONGOLAB_URI
  : 'mongodb://' + config.host + '/' + config.database;


var db = mongoose.connection;

db.on('error', err=>{
  console.log('DBERROR:: ', err);
});

let connect = ()=> {
  return new Promise((resolve, reject)=>{
    mongoose.connect(url);
    db.once('error', err=>{
      console.log('DB:Connect Error.', err);
      reject(err);
    });
    db.once('open', ()=>{
      console.log('DB:Connect Successful.');
      resolve();
    });
  });
}

export default connect;