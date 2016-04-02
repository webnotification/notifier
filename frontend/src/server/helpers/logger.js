import path from 'path';
import winston from 'winston';

let logCreator = (options) => {

  let errorLogOptions = { level: 'error', filename: options.errorFile };
  let accessLogOptions= { filename: options.accessFile };

  return new (winston.Logger)({
    transports: [
      new (winston.transports.Console),
      new (winston.transports.File)(errorLogOptions)
    ]
  })
}

export default logCreator;