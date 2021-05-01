import mongoose from 'mongoose';

export default new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectID,
    ref: 'User',
    required: [true, "profile must reference a user"],
    unique: true,
  },
  dp: String,
  firstName: {type: String, trim: true},
  lastName: { type: String, trim: true },
  gender: {
    type: Number,
    enum: ["Male", "Female", "Others"],
    get: (v) => {
      const genderToEmun = { 0: "Male", 1: "Female", 2: "Others" };
      return genderToEmun[v];
    },
    set: (v) => {
      const genderToEmun = {"Male": 0, "Female": 1, "Others": 1};
      return genderToEmun[v];
    }
  },
  qoute: String,
  description: String,
}, {
  timestamps: false,
  skipVersioning: { dontVersionMe: true },
})