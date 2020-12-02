import express from "express";
import mongoose from "mongoose";
import { Stripe } from "stripe";
import { body, validationResult } from "express-validator";
import { createTransport } from "nodemailer";
import { toDataURL } from "qrcode";
import { env } from "./config/keys";
import Ticket from "./models/Ticket";
import Event from "./models/Event";

const stripe = new Stripe(env.stripeSecretKey, { apiVersion: "2020-08-27" });

let transporter = createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: env.email,
    pass: env.emailPassword,
  },
});

mongoose.connect(env.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(express.static("public"));
app.use(express.json());

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

    const qr = await toDataURL(ticket.id);

    const mailTemplate = `
    <h1>Hello ${firstName} ${lastName}</h1>
    <p>Thanks for buying ticket for ${eventFound.nameOfEvent}, in ${eventFound.place}, taking place on ${eventFound.dateOfEvent}</p>
    <img src="${qr}">
    `;

    let message = {
      from: env.email,
      to: email,
      subject: `Ticket for ${eventFound.nameOfEvent}`,
      html: mailTemplate,
    };
    transporter.sendMail(message, (error, info) => {
      if (error) {
        res.status(500).send("Error while trying to send mail");
        return;
      } else console.log("Mail sent:", info.response);
    });

    res.status(200).send(paymentIntent.client_secret);
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
