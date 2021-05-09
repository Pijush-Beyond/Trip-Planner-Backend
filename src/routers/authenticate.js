import express from 'express';
import { getUser, registerUser, updateProfile } from '../services/authentication.js';
import authentication, { signIn } from "../utilities/authentication.js";
import multer from "multer";

const router = express.Router();

router.use(multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `public/dps/`)
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
  })}).single('dp'))

router.get('/autoLogin', authentication, async (req, res, next) => {
  try{
    const user = await getUser(req.user);
    res.status(200).json({ data: user, message: 'login successfull', error_message: null, status: 200, error: {} });
  } catch (e) {
    if (e.status === 404) res.clearCookie('user');
    next(e);
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const user = await getUser(req.body);
    const userData = {...user};
    delete userData.profile;
    signIn(req,res, user);
    res.status(200).json({data: user, message: 'login successfull', error_message: null, status: 200, error: {}});
  } catch (e) { 
    next(e);
  }
});

router.get('/logout', (req, res, next) => {
  res.clearCookie('user');
  res.status(200).json({ data: null, message: 'logout successfull', error_message: null, status: 200, error: {} });
})

router.post('/register', (req, res, next) =>
  getUser(req.body)
    .then((user) => {
      const err = new Error('Email Already Registered');
      err.status = 404;
      err.error= {
        error: "Email already Exists"
      }
      next(err);
    }).catch(e => {
      if (e.status === 404) registerUser(req.body).then((user) => {
          signIn(req,res, user);
          res.status(200).json({data: user, message: 'registration successfull', error_message: null, status: 200,});
        }).catch(e=> next(e))
      else next(e);
    })
)



router.post('/update', authentication, (req, res, next) => {
  req.body.dp = `${process.env.DOMAIN}/dps/${req.file.filename}`;
  updateProfile(req.user, req.body).then(user => res.sendStatus(204)).catch(e => next(e))
})

export default router;
