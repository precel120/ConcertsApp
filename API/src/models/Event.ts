import mongoose from "mongoose";

const { Schema } = mongoose;

const eventSchema = new Schema({
  imageUrl: String,
  nameOfEvent: String,
  dateOfEvent: Date,
  place: String,
  description: String,
});

const Event = mongoose.model("events", eventSchema);
export default Event;
