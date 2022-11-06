import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const contactSchema = new Schema(
  {
    __v: {
        type: Number,
        select: false
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator(v: string) {
                    return /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(v);
            },
            message: 'E-mail format is incorrect!'
        }
    },
    phone: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true, // 验证必填
        max: 360, // 最大值验证
        min: 3 // 最小值验证
    },
    del: { // 软删除
        type: Boolean,
        select: false,
        default: false
    },
  },
  { timestamps: true }
);

export default model('Contact', contactSchema);
