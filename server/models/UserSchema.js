const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  // address: {
  //   type: String,
  //   required: false
  // },
  mobile: {
    type: Number,
    required: false
  },
  password: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
    default: null,
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const   User = mongoose.model('User', UserSchema);

module.exports = User;