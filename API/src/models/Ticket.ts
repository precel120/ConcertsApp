import { Schema, model } from "mongoose";

const ticketSchema = new Schema({
  email: String,
  firstName: String,
  lastName: String,
  phoneNumber: String,
  eventId: String,
  purchaseDate: Date,
});

const Ticket = model("tickets", ticketSchema);
export default Ticket;
