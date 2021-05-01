import db from "../database/db.js"

export const getUser = (userData, bool = false) => new Promise(async (resolve, reject) => {
  const user = await (await db.User()).findOne({ $and: [{ email: userData.email }, { password: userData.password }] },{_id:false,__v:0})
    .populate('profile')
    .catch(e => {
      e.status = 400;
      reject(e)
    });
    
  if (Boolean(user)) resolve(bool ? Boolean(user) : user);
  else {
    const err = new Error('user not exsist');
    err.status = 404;
    reject(err);
  }
})

export const registerUser = (userData) => new Promise(async (resolve, reject) => {
  const user = await (await db.User()).create(userData)
  .catch(e => {
    e.status = 400;
    reject(e)
  });
  delete user._doc._id;
  delete user._doc.__v;
  resolve(user);
})