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
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// TODO Fix error handling in payment
app.post("/api/checkout", async (req, res) => {
  try {
    const { email, firstName, lastName, phoneNumber } = req.body;
    const id = req.query.id;
    let eventFound: any;
    const event = await Event.findById(id, (error, result) => {
      if(!error)  eventFound = result;
      else throw new Error(error.message);
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
      receipt_email: email,
      metadata: { integration_check: "accept a payment" },
    });
    console.log(paymentIntent);
    const ticket = new Ticket({
      email: email,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      eventId: eventFound.id,
      purchaseDate: new Date(),
    });
    ticket.save((error) => {
      if (error) {
        throw new Error(error.message);
      }
    });
    console.log(paymentIntent.client_secret);
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
