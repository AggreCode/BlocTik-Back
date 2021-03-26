const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  nonce: {
    type: Number,
    
    default: Math.floor(Math.random() * 1000000)
  },
  publicAddress:{
    type: String,
    unique: true,
   required: true,
   lowercase:true
  }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);