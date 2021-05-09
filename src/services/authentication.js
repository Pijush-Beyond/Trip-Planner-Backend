import db from "../database/db.js"

export const getUser = (userData, bool = false) => new Promise(async (resolve, reject) => {
  await db.Profile();
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
    err.error = {
      error: "Invalid Creadintials"
    }
    reject(err);
  }
})

export const registerUser = (userData) => new Promise(async (resolve, reject) => {
  const user = await (await db.User()).create(userData)
  .catch(e => {
    e.status = 400;
    e.error = {
      email: "Email already Exists"
    }
    reject(e)
  });
  delete user._doc._id;
  delete user._doc.__v;
  resolve(user);
})

export const updateProfile = (userData, userUpdate) => new Promise(async (resolve, reject) => {
  const userUpdateData = {...userUpdate};
  delete userUpdateData.profile;
  const profileUpdateData = { ...userUpdate };
  
  await db.Profile();
  const user = await (await db.User()).findOne({ $and: [{ email: userData.email }, { password: userData.password }] }, { __v: 0 })
    .populate('profile');

  if (!user) {
    const err = new Error('user not exsist');
    err.status = 404;
    err.error = {
      error: "Your account does not exist"
    }
    reject(err);
    return;
  }

  if (!user.populated('profile')) {
    const profile = await (await db.Profile())(profileUpdateData);
    user.profile = profile;
  }

  console.log()
  user.set({ ...userUpdateData, active: true });
  user.profile.set({...profileUpdateData, user})
  delete user.profile._doc.__v;


  user.save().then(userd =>
    user.profile.save().then(() => resolve(true))
  ).catch(e => {
    e.status = 400;
    e.error = {unknown: "Went something wrong"}
    reject(e);
  })
})