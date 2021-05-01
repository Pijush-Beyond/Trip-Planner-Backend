import jwt from 'jsonwebtoken';
import fs from 'fs';
import { log } from 'express-errorlog';

export const signIn = (res, data) => {
  res.cookie('user', jwt.sign(
    { data },
    fs.readFileSync('secret.key'),
  ))
}

export default (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.user) {
    token = req.cookies.user;
  }

  if (token) {
    try {
      const data = jwt.verify(token, fs.readFileSync('secret.key'));
      req.user = data.data;
      next();
    } catch (e) {
      res.redirect('/login');
    }
  }
  else
    res.redirect('/login');
}