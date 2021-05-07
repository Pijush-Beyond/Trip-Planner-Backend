import mongoose from 'mongoose';

export default new mongoose.Schema({
  password: {
    type: String,
    required: [true,'Please provide password inorder to create user']
  },
  email: {
    type: String,
    required: [true,"Please provide email inorder to create user"],
    unique: true,
    index: true
  },
  profile: {
    type: mongoose.Types.ObjectId,
    ref: 'Profile',
  },
  active:{
    type: Boolean,
    default: false
  }
}, {
  timestamps: false,
  skipVersioning: { dontVersionMe: true },
})