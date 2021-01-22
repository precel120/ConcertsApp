import express from "express";
import mongoose from "mongoose";
import { Stripe } from "stripe";
import { body, validationResult } from "express-validator";
import { createTransport } from "nodemailer";
import { toDataURL } from "qrcode";
import { env } from "./config/keys";
import Ticket from "./models/Ticket";
import Event from "./models/Event";
import StatusError from "./StatusError";

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

const findEvent = async (id: string, next: express.NextFunction) => {
  let eventFound: any;
  await Event.findById(
    id,
    (error: mongoose.CallbackError, result: mongoose.Document<any | null>) => {
      if (!error) eventFound = result;
      else {
        let err = new StatusError("No event found", 404);
        return next(err);
      }
    }
  );
  return eventFound;
};

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
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        let err = new StatusError("Error while validating body", 400);
        return next(err);
      }

      const { id, email, firstName, lastName, phoneNumber } = req.body;

      const event = await findEvent(id, next);

      Ticket.find({ eventId: event.id }, async (error, tickets) => {
        if (!error) {
          if (event?.toJSON().maxTicketsAmount - 1 < tickets.length) {
            let err = new StatusError("No tickets left", 403);
            return next(err);
          }
        } else {
          let err = new StatusError("No tickets found", 404);
          return next(err);
        }
        const paymentIntent = await stripe.paymentIntents.create({
          amount: event.ticketPrice, // NEEDS TO BE ABOVE SOME VALUE!!!!!!!
          currency: "pln",
          payment_method_types: ["card"],
          receipt_email: email,
          metadata: { integration_check: "accept a payment" },
        });
        if (!paymentIntent) {
          let err = new StatusError("Creating payment intent failed", 400);
          return next(err);
        }

        const ticket = new Ticket({
          email: email.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phoneNumber: phoneNumber.trim(),
          eventId: event.id,
          purchaseDate: new Date(),
        });
        ticket.save((error) => {
          if (error) {
            let err = new StatusError("Error while saving to DB", 500);
            return next(err);
          }
        });

        const qr = await toDataURL(ticket.id);

        if (!qr) {
          let err = new StatusError("Error while creating QR Code", 400);
          return next(err);
        }

        const mailTemplate = `
        <h1>Hello ${firstName} ${lastName}</h1>
        <p>Thanks for buying ticket for ${event.nameOfEvent}, in ${event.place}, taking place on ${event.dateOfEvent}</p>
        <img src="${qr}">
        `;

        const message = {
          from: env.email,
          to: email,
          subject: `Ticket for ${event.nameOfEvent}`,
          html: mailTemplate,
        };
        transporter.sendMail(message, (error, info) => {
          if (error) {
            let err = new StatusError("Error while sending mail", 500);
            return next(err);
          } else console.log("Mail sent:", info.response);
        });

        return res.status(200).send(paymentIntent.client_secret);
      });
    } catch (error) {
      next(error);
    }
  }
);

app.get("/api/events", (req: express.Request, res: express.Response) => {
  Event.find({}, (error, events) => {
    if (!error) {
      return res.status(200).send(events.slice());
    } else return res.status(404).send("Couldn't find events");
  });
});

//Get for how many tickets are left,NOT get for event by id
app.get(
  "/api/events/:id",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const id = req.params.id;
    const event = await findEvent(id, next);
    Ticket.find({ eventId: id }, async (error, tickets) => {
      if (error) {
        let err = new StatusError("No tickets found", 404);
        return next(err);
      }
      const ticketsLeft = event?.toJSON().maxTicketsAmount - tickets.length;
      res.status(200).send({event, ticketsLeft});
    });
  }
);

app.use(function (
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);
