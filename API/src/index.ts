import express from "express";
import mongoose from "mongoose";
import { Stripe } from "stripe";
import { env } from "./config/keys";
import Ticket from "./models/Ticket";
import Event from "./models/Event";

const stripe = new Stripe(env.stripeSecretKey, { apiVersion: "2020-08-27" });
mongoose.connect(env.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.post("/api/checkout", async (req, res) => {
  try {
    const event = await Event.findById("5f6b8928bb90b180b5c22da7");
    Ticket.find({eventId: event?.id}, (error, tickets) => {
      console.log(event?.toJSON().maxTicketsAmount);
      if(event?.toJSON().maxTicketsAmount - 1 < tickets.length) {
        throw new Error("Not enough tickets");
      }
    });
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 400,
      currency: "pln",
      payment_method_types: ["card"],
      metadata: { integration_check: "accept a payment" },
    });
    const ticket = new Ticket({
      firstName: "test",
      lastName: "test",
      eventId: event?.id,
      purchaseDate: new Date(),
    });
    ticket.save((error) => {
      if(error) {
        throw new Error(error.message);
      }
    });
    res.status(200).send(paymentIntent.client_secret);
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error.message });
  }
});

app.get("/api/events", (req, res) => {
  Event.find({}, (error, events) => {
    if (!error) {
      const eventsMap = events.slice();
      res.send(eventsMap);
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);
