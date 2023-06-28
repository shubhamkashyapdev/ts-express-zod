import mongoose from 'mongoose';
import { IUser } from 'src/types/users';

type UserDocument = IUser & mongoose.Document;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: [true, 'Username is already taken'],
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
    unique: [true, 'Phone number is alredy taken'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: [true, 'Email is alredy taken'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  phone_verified: {
    type: Boolean,
    default: false,
  },
  email_verified: {
    type: Boolean,
    default: false,
  },
  is_verified: {
    type: Boolean,
    default: false,
  },
});

const UserModal = mongoose.model<UserDocument>('users', userSchema);
export default UserModal;
