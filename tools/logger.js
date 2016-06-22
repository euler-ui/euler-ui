import winston from 'winston'
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      colorize: true
    }),
    new (winston.transports.File)({
      filename: 'build.log',
      colorize: true
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: 'error.log',
      colorize: true,
      humanReadableUnhandledException: true
    })
  ]
});
export default logger