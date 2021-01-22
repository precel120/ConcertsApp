"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const stripe_1 = require("stripe");
const express_validator_1 = require("express-validator");
const nodemailer_1 = require("nodemailer");
const qrcode_1 = require("qrcode");
const keys_1 = require("./config/keys");
const Ticket_1 = __importDefault(require("./models/Ticket"));
const Event_1 = __importDefault(require("./models/Event"));
const StatusError_1 = __importDefault(require("./StatusError"));
const stripe = new stripe_1.Stripe(keys_1.env.stripeSecretKey, { apiVersion: "2020-08-27" });
let transporter = nodemailer_1.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: keys_1.env.email,
        pass: keys_1.env.emailPassword,
    },
});
mongoose_1.default.connect(keys_1.env.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const app = express_1.default();
app.use(express_1.default.static("public"));
app.use(express_1.default.json());
const findEvent = (id, next) => __awaiter(void 0, void 0, void 0, function* () {
    let eventFound;
    yield Event_1.default.findById(id, (error, result) => {
        if (!error)
            eventFound = result;
        else {
            let err = new StatusError_1.default("No event found", 404);
            return next(err);
        }
    });
    return eventFound;
});
app.post("/api/tickets", [
    express_validator_1.body("email").trim().isEmail().isLength({ min: 8 }).normalizeEmail(),
    express_validator_1.body("firstName")
        .trim()
        .isString()
        .isLength({ min: 2 })
        .matches(/^[^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/),
    express_validator_1.body("lastName")
        .trim()
        .isString()
        .isLength({ min: 2 })
        .matches(/^[^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/),
    express_validator_1.body("phoneNumber")
        .trim()
        .isString()
        .isLength({ min: 8 })
        .matches(/^((?<!\w)(\(?(\+|00)?48\)?)?[ -]?\d{3}[ -]?\d{3}[ -]?\d{3}(?!\w))$/),
], (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            let err = new StatusError_1.default("Error while validating body", 400);
            return next(err);
        }
        const { id, email, firstName, lastName, phoneNumber } = req.body;
        const event = yield findEvent(id, next);
        Ticket_1.default.find({ eventId: event.id }, (error, tickets) => __awaiter(void 0, void 0, void 0, function* () {
            if (!error) {
                if ((event === null || event === void 0 ? void 0 : event.toJSON().maxTicketsAmount) - 1 < tickets.length) {
                    let err = new StatusError_1.default("No tickets left", 403);
                    return next(err);
                }
            }
            else {
                let err = new StatusError_1.default("No tickets found", 404);
                return next(err);
            }
            const paymentIntent = yield stripe.paymentIntents.create({
                amount: event.ticketPrice,
                currency: "pln",
                payment_method_types: ["card"],
                receipt_email: email,
                metadata: { integration_check: "accept a payment" },
            });
            if (!paymentIntent) {
                let err = new StatusError_1.default("Creating payment intent failed", 400);
                return next(err);
            }
            const ticket = new Ticket_1.default({
                email: email.trim(),
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                phoneNumber: phoneNumber.trim(),
                eventId: event.id,
                purchaseDate: new Date(),
            });
            ticket.save((error) => {
                if (error) {
                    let err = new StatusError_1.default("Error while saving to DB", 500);
                    return next(err);
                }
            });
            const qr = yield qrcode_1.toDataURL(ticket.id);
            if (!qr) {
                let err = new StatusError_1.default("Error while creating QR Code", 400);
                return next(err);
            }
            const mailTemplate = `
        <h1>Hello ${firstName} ${lastName}</h1>
        <p>Thanks for buying ticket for ${event.nameOfEvent}, in ${event.place}, taking place on ${event.dateOfEvent}</p>
        <img src="${qr}">
        `;
            const message = {
                from: keys_1.env.email,
                to: email,
                subject: `Ticket for ${event.nameOfEvent}`,
                html: mailTemplate,
            };
            transporter.sendMail(message, (error, info) => {
                if (error) {
                    let err = new StatusError_1.default("Error while sending mail", 500);
                    return next(err);
                }
                else
                    console.log("Mail sent:", info.response);
            });
            return res.status(200).send(paymentIntent.client_secret);
        }));
    }
    catch (error) {
        next(error);
    }
}));
app.get("/api/events", (req, res) => {
    Event_1.default.find({}, (error, events) => {
        if (!error) {
            return res.status(200).send(events.slice());
        }
        else
            return res.status(404).send("Couldn't find events");
    });
});
//Get for how many tickets are left,NOT get for event by id
app.get("/api/events/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const event = yield findEvent(id, next);
    Ticket_1.default.find({ eventId: id }, (error, tickets) => __awaiter(void 0, void 0, void 0, function* () {
        if (error) {
            let err = new StatusError_1.default("No tickets found", 404);
            return next(err);
        }
        const ticketsLeft = (event === null || event === void 0 ? void 0 : event.toJSON().maxTicketsAmount) - tickets.length;
        res.status(200).send({ event, ticketsLeft });
    }));
}));
app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode)
        err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});
const PORT = process.env.PORT || 5000;
app.listen(PORT);
//# sourceMappingURL=index.js.map