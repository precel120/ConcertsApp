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

app.use(express.static("public"));

// TODO Fix error handling in payment
app.post("/api/checkout", async (req, res) => {
  try {
    const { id } = req.body;
    console.log(id);
    let eventFound: any;
    const event = await Event.findById(id, (err, result) => {
      eventFound = result?.toObject;
    });
    Ticket.find({ eventId: event?.id }, (error, tickets) => {
      if (!error) {
        if (event?.toJSON().maxTicketsAmount - 1 < tickets.length) {
          throw new Error("Not enough tickets");
        }
      }
    });
    const paymentIntent = await stripe.paymentIntents.create({
      amount: eventFound.ticketPrice,
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
      if (error) {
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
