import { Schema, model } from "mongoose";

const ticketSchema = new Schema({
  userId: String,
  email: String,
  firstName: String,
  lastName: String,
  phoneNumber: String,
  eventId: String,
  purchaseDate: Date,
  qr: String
});

const Ticket = model("tickets", ticketSchema);
export default Ticket;
