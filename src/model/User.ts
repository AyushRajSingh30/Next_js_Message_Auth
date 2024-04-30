//This Schema is created for mongoose mean mongodb

//Document used for type sefty
import mongoose, { Schema, Document } from "mongoose";

//make message data type by interface
export interface Message extends Document {
  content: string;
  createdAt: Date;
}

//We want Mongoose Schema that why we used Schema<Message> but we used MessageSchema:Message that time we directly assine value this is not create Mongoose schema.

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

export interface User extends Document {
  username: string;
  password: string;
  email: string;
  verifyCode: string;
  verifycodeExpire: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is reqired"],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is reqired"],
  },

  email: {
    type: String,
    required: [true, "Email is reqired"],
    unique: true,
    trim: true,
    match: [/.+\@.+\..+/, "please used a valid email address"], //this is mongoose rezis method for matching email
  },
  verifyCode: {
    type: String,
    required: [true, "verifycode  is reqired"],
  },
  verifycodeExpire: {
    type: Date,
    required: [true, " verifycodeExpire is reqired"],
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },

  messages: [MessageSchema],
});

//nextjs is edge runtime famework mongoose.models.User means user already exists (as mongoose.Model<User>)  it mean mongoose user exists than give user data.
//mongoose.model<User>("User", UserSchema); mongoose user not exist created new user

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
