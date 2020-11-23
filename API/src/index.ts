import express from "express";
import mongoose from "mongoose";
import { Stripe } from "stripe";
import { body, validationResult } from "express-validator";
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

// TODO Change to proper status codes
app.post(
  "/api/checkout",
  [
    body("email").trim().isEmail().isLength({ min: 8 }).normalizeEmail(),
    body("firstName").trim().isString().isLength({ min: 2 }),
    body("lastName").trim().isString().isLength({ min: 2 }),
    body("phoneNumber").trim().isString().isLength({ min: 3, max: 12 }),
  ],
  async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const { email, firstName, lastName, phoneNumber } = req.body;
    const { id } = req.query;
    let eventFound: any;
    const event = await Event.findById(id, (error, result) => {
      if (!error) eventFound = result;
      else {
        res.status(404).send("No event found");
        return;
      }
    });
    Ticket.find({ eventId: event?.id }, (error, tickets) => {
      if (!error) {
        if (event?.toJSON().maxTicketsAmount - 1 < tickets.length) {
          res.status(404).send("No tickets left");
          return;
        }
      } else res.status(404).send("No tickets found") 
    });
    const paymentIntent = await stripe.paymentIntents.create({
      amount: eventFound.ticketPrice, // NEEDS TO BE ABOVE SOME VALUE!!!!!!!
      currency: "pln",
      payment_method_types: ["card"],
      receipt_email: email,
      metadata: { integration_check: "accept a payment" },
    });
    const ticket = new Ticket({
      email: email.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phoneNumber: phoneNumber.trim(),
      eventId: eventFound.id,
      purchaseDate: new Date(),
    });
    ticket.save((error) => {
      if (error) {
        res.status(404).send("Ticket cannot be added to database");
        return;
      }
    });
    res.status(200).send(paymentIntent.client_secret);
    return;
  }
);

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
