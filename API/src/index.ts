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
app.use(express.urlencoded({ extended: true }));

// TODO Make proper status codes
app.post("/api/checkout", async (req, res) => {
  const { email, firstName, lastName, phoneNumber } = req.body;
  let isOk = true;
  const id = req.query.id;
  let eventFound: any;
  const event = await Event.findById(id, (error, result) => {
    if (!error) eventFound = result;
    else {
      isOk = false;
      res.status(404).send("No event found");
    }
  });
  Ticket.find({ eventId: event?.id }, (error, tickets) => {
    if (!error) {
      if (event?.toJSON().maxTicketsAmount - 1 < tickets.length) {
        isOk = false;
        res.status(404).send("No tickets left");
      }
    }
  });
  const paymentIntent = await stripe.paymentIntents.create({
    amount: eventFound.ticketPrice, // NEEDS TO BE ABOVE SOME VALUE!!!!!!!
    currency: "pln",
    payment_method_types: ["card"],
    receipt_email: email,
    metadata: { integration_check: "accept a payment" },
  });
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
      isOk = false;
      res.status(404).send("Ticket cannot be added to database");
    }
  });
  if (isOk) {
    res.status(200).send(paymentIntent.client_secret);
  }
});

app.get("/api/events", (req, res) => {
  Event.find({}, (error, events) => {
    if (!error) {
      const eventsMap = events.slice();
      res.status(200).send(eventsMap);
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);
