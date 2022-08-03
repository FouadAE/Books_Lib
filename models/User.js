const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {isEmail} = require('validator')
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  email: {
    type: String,
    required: [true,'please enter email'],
    unique:true,
    lowercase:true,
    validate:[isEmail, 'please enter a valid email']
  },
  password: {
    type:String,
    required: [true,'please enter password'],
    minlength:[6,'at lesat 6 caracters'],
  },
}, { timestamps: true });

//fire a function after doc saved to hash code
userSchema.post('save',function (doc,next){
  console.log('new user  created and saved ',doc);
  //next is use to move one to next midlware 
  next();
})

//fire a function after doc saved to hash code
userSchema.pre('save',async function (next){
  const salt = bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password,parseInt(salt));
  next()
})

userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
};


const User = mongoose.model('User', userSchema);    
module.exports = User;