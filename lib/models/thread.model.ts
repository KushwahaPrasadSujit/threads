import { models } from "@/constants";
import mongoose from "mongoose";

const threadSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: models.user,
    required: true,
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: models.community,
    requried: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  parentID: {
    type: String,
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: models.thread,
    },
  ],
});

const Thread =
  mongoose.models.Thread || mongoose.model(models.thread, threadSchema);

export default Thread;
