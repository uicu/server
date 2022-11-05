import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const periodicalSchema = new Schema(
  {
    __v: {
      type: Number,
      select: false
    },
    pic: {
      type: String,
      required: false
    },
    title: {
      type: String,
      index: true, // 辅助索引
      required: true, // 验证必填
      max: 1000, // 最大值验证
      min: 3 // 最小值验证
    },
    describe: { // 描述
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    topics: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Topic'
        }
      ]
    },
    pv: {
      type: Number,
      required: true,
      default: 0
    },
    del: { // 软删除
      type: Boolean,
      select: false,
      default: false
    },
  },
  { timestamps: true }
);

export default model('Periodical', periodicalSchema);
