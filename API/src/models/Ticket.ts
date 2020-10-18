import mongoose from "mongoose";

const { Schema } = mongoose;

const ticketSchema = new Schema({
  email: String,
  firstName: String,
  lastName: String,
  phoneNumber: Number,
  eventId: String,
  purchaseDate: Date,
});

const Ticket = mongoose.model("tickets", ticketSchema);
export default Ticket;
