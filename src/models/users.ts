import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { ScopeType } from '../modules/auth';

const SALT_WORK_FACTOR = 10;
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    __v: {
      type: Number,
      select: false
    },
    name: {
      type: String,
      required: true,
      unique: true,  // 唯一索引
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,  // 唯一索引
      validate: {
        validator(v) {
          return /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(v);
        },
        message: 'E-mail format is incorrect!'
      }
    },
    password: {
      type: String,
      required: true,
      select: false // mongoose的一个语法，获取的时候不显示
    },
    avatar: {
      type: String,
      default: '/avatar/default.png'
    },
    birth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'genderless'],
      default: 'male',
    },
    introduce: {
      type: String,
      default: 'No profile yet',
    },
    scope: {
      type: Number,
      select: false,
      default: ScopeType.USER
    },
    del: { // 删除
      type: Boolean,
      default: false,
      select: false
    },
  },
  { timestamps: true }
);

userSchema.pre('save', function(next) {
  // 保存之前中间件
  const user = this;
  // 加盐加密，是否更改，mongoose上的方法
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// documents 的实例方法
userSchema.methods = {
  comparePassword: (_password: string, password: string) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(_password, password, (err, isMatch) => {
        if (!err) resolve(isMatch);
        else reject(err);
      });
    });
  }
};

export default model('User', userSchema);
