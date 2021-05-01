import express from 'express';
import { getUser, registerUser } from '../services/authentication.js';
import { signIn } from "../utilities/authentication.js";

const router = express.Router();

router.post('/login', async (req, res, next) => {
  try {
    const user = await getUser(req.body);
    signIn(res, user);
    res.status(200).json({data: user, message: 'login successfull', error_message: null, status: 200});
  } catch (e) { 
    next(e);
  }
});

router.get('/logout', (req, res, next) => {
  res.clearCookie('user');
  res.status(200).json({ data: null, message: 'logout successfull', error_message: null, status: 200 });
})

router.post('/registration', (req, res, next) =>
  getUser(req.body)
    .then((user) => {
      const err = new Error('Email Already Registered');
      err.status = 404;
      next(err);
    }).catch(e => {
      if (e.status === 404) registerUser(req.body).then((user) => {
          signIn(res, user);
          res.status(200).json({data: user, message: 'registration successfull', error_message: null, status: 200});
        }).catch(e=> next(e))
      else next(e);
    })
)
export default router;
