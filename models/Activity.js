import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

const Activity = mongoose.model("Activity", ActivitySchema);

export default Activity;
