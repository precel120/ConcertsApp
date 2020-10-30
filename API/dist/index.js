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
const keys_1 = require("./config/keys");
const Ticket_1 = __importDefault(require("./models/Ticket"));
const Event_1 = __importDefault(require("./models/Event"));
const stripe = new stripe_1.Stripe(keys_1.env.stripeSecretKey, { apiVersion: "2020-08-27" });
mongoose_1.default.connect(keys_1.env.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const app = express_1.default();
app.use(express_1.default.static("public"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// TODO Make proper status codes
app.post("/api/checkout", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, firstName, lastName, phoneNumber } = req.body;
    let isOk = true;
    const id = req.query.id;
    let eventFound;
    const event = yield Event_1.default.findById(id, (error, result) => {
        if (!error)
            eventFound = result;
        else {
            isOk = false;
            res.status(404).send("No event found");
        }
    });
    Ticket_1.default.find({ eventId: event === null || event === void 0 ? void 0 : event.id }, (error, tickets) => {
        if (!error) {
            if ((event === null || event === void 0 ? void 0 : event.toJSON().maxTicketsAmount) - 1 < tickets.length) {
                isOk = false;
                res.status(404).send("No tickets left");
            }
        }
    });
    const paymentIntent = yield stripe.paymentIntents.create({
        amount: eventFound.ticketPrice,
        currency: "pln",
        payment_method_types: ["card"],
        receipt_email: email,
        metadata: { integration_check: "accept a payment" },
    });
    const ticket = new Ticket_1.default({
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
}));
app.get("/api/events", (req, res) => {
    Event_1.default.find({}, (error, events) => {
        if (!error) {
            const eventsMap = events.slice();
            res.status(200).send(eventsMap);
        }
    });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT);
//# sourceMappingURL=index.js.map