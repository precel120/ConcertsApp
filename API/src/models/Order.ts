import { Schema, model } from "mongoose";

const orderSchema = new Schema({
  userId: String,
  dateOfPurchase: Date,
});

const Order = model("orders", orderSchema);
export default Order;
