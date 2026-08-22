import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: [{
      title:{type:String,required:true},
      description:{type:String,required:true},
      date:{type:Date,default:Date.now},
      completed:{type:Boolean,default:false}
    }],
  },
  otp: {
    type: String,
  },
  otpExpire: {
    type: Date,
  },
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
