import { Router, Response, Request, NextFunction } from "express";
import mongoose from "mongoose";
import { body, validationResult } from "express-validator";
import { Stripe } from "stripe";
import { toDataURL } from "qrcode";
import { createTransport } from "nodemailer";
import jwt, { verify } from "jsonwebtoken";
import { env } from "../config/keys";
import { checkCurrentUser } from "./verifyToken";
import Ticket from "../models/Ticket";
import StatusError from "../StatusError";
import Event from "../models/Event";
import User from "../models/User";

let transporter = createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: env.email,
    pass: env.emailPassword,
  },
});
const stripe = new Stripe(env.stripeSecretKey, { apiVersion: "2020-08-27" });
const ticketsRouter = Router();

const findEvent = async (id: string, next: NextFunction) => {
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

ticketsRouter.post(
  "/api/tickets_guest",
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
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        let err = new StatusError("Error while validating body", 400);
        return next(err);
      }

      const { id, email, firstName, lastName, phoneNumber } = req.body;

      const event = await findEvent(id, next);
      if(!event) {
        return next(new StatusError("Event not found", 400));
      }

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
          userId: "",
          email: email.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phoneNumber: phoneNumber.trim(),
          eventId: event.id,
          purchaseDate: new Date(),
          qr: "",
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

        await Ticket.updateOne({ email: email.trim() }, { qr: qr });

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

ticketsRouter.post("/api/tickets", checkCurrentUser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return next(new StatusError("Token not found", 400));
    }
    const decoded = jwt.decode(token, { complete: true });
    const user = await User.findById(decoded?.payload._id);
    if(!user) {
      return next(new StatusError("User not found", 400));
    }
    const { _id, email, firstName, lastName, phoneNumber } = user;

    const { id } = req.body;

    const event = await findEvent(id, next);
    if(!event) {
      return next(new StatusError("Event not found", 400));
    }

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
        receipt_email: user.email,
        metadata: { integration_check: "accept a payment" },
      });
      if (!paymentIntent) {
        let err = new StatusError("Creating payment intent failed", 400);
        return next(err);
      }

      const ticket = new Ticket({
        userId: _id,
        email: email.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phoneNumber.trim(),
        eventId: event.id,
        purchaseDate: new Date(),
        qr: "",
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

      await Ticket.updateOne({ email: email.trim() }, { qr: qr });

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
});

ticketsRouter.get(
  "/api/tickets",
  checkCurrentUser,
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;
    if (!token) {
      return next(new StatusError("Token not found", 400));
    }
    const decoded = jwt.decode(token, { complete: true });
    const tickets = await Ticket.find({ userId: decoded?.payload._id });
    if (!tickets) {
      return next(new StatusError("Ticket not found", 404));
    }
    res.status(200).send(tickets);
  }
);

export default ticketsRouter;
