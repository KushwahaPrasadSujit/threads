import { models } from "@/constants";
import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: String,
  bio: String,
  createdBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: models.user,
    },
  ],
  threads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: models.thread,
    },
  ],
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: models.user,
    },
  ],
});

const Community =
  mongoose.models.Community ||
  mongoose.model(models.community, communitySchema);

export default Community;
