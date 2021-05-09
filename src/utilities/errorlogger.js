import { appendFile } from "fs";
import errorlogger, { log } from 'express-errorlog';

export default ( err, req, res, next,) => {
  if (process.env.NODE_ENV === "development") log.error(err.stack);

  const errorMess = [
    new Date().toLocaleString(),'::\t',
    req.method, '\t', req.protocol, "://", req.hostname, '/', req.originalUrl,'\t',err.status || 500, '\n',
    err.stack,
    '\n\n',
  ];
  appendFile('errorlog.log', errorMess.join(''),(e)=> e?console.log(e):'')
  
  res.status(err.status || 500).json({ data: null, message: null, error_message: err.message || err, status: err.status || 500, error: err.error || {} })
}