import express from "express";
import mongoose from "mongoose";
import { Stripe } from "stripe";
import { body, validationResult } from "express-validator";
import { createTransport } from "nodemailer";
import Mailgen from "mailgen";
import { env } from "./config/keys";
import Ticket from "./models/Ticket";
import Event from "./models/Event";

const stripe = new Stripe(env.stripeSecretKey, { apiVersion: "2020-08-27" });

let transporter = createTransport({
  service: "GMail",
  secure: true,
  auth: {
    user: env.email,
    pass: env.emailPassword,
  },
});

let MailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Nodemailer",
    link: env.mainURL,
  },
});

mongoose.connect(env.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TODO Check if proper Status Codes
app.post(
  "/api/tickets",
  [
    body("email").trim().isEmail().isLength({ min: 8 }).normalizeEmail(),
    body("firstName")
      .trim()
      .isString()
      .isLength({ min: 2 })
      .matches(/^[^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/),
    body("lastName")
      .trim()
      .isString()
      .isLength({ min: 2 })
      .matches(/^[^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/),
    body("phoneNumber")
      .trim()
      .isString()
      .isLength({ min: 8 })
      .matches(
        /^((?<!\w)(\(?(\+|00)?48\)?)?[ -]?\d{3}[ -]?\d{3}[ -]?\d{3}(?!\w))$/
      ),
  ],
  async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { id, email, firstName, lastName, phoneNumber } = req.body;

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
          res.status(403).send("No tickets left");
          return;
        }
      } else res.status(404).send("No tickets found");
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
        res.status(500).send("Ticket cannot be added to database");
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
    } else res.status(404).send("Couldn't find events");
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);
