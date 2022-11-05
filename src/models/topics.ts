import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const topicSchema = new Schema(
  {
    __v: {
      type: Number,
      select: false
    },
    name: {
      type: String,
      required: true
    },
    describe: {
      type: String,
      required: true
    },
    del: { // 软删除
      type: Boolean,
      select: false,
      default: false
    },
  },
  { timestamps: true }
);

export default model('Topic', topicSchema);
