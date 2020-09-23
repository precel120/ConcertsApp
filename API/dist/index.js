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
app.post("/api/checkout", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let event;
    Event_1.default.findById("5f6b8928bb90b180b5c22da7", (error, res) => {
        if (!error) {
            event = res === null || res === void 0 ? void 0 : res.toJSON();
            if (event.ticketAmount - 1 < 0) {
                return;
            }
        }
    });
    try {
        const paymentIntent = yield stripe.paymentIntents.create({
            amount: 400,
            currency: "pln",
            payment_method_types: ["card"],
            metadata: { integration_check: "accept a payment" },
        });
        const ticket = new Ticket_1.default({
            firstName: "test",
            lastName: "test",
            eventId: "test",
            purchaseDate: new Date(),
        });
        ticket.save((error) => {
            if (error) {
                res.status(500).json({ statusCode: 500, message: error.message });
            }
        });
        res.status(200).send(paymentIntent.client_secret);
    }
    catch (error) {
        res.status(500).json({ statusCode: 500, message: error.message });
    }
}));
app.get("/api/events", (req, res) => {
    Event_1.default.find({}, (error, events) => {
        if (!error) {
            const eventsMap = events.slice();
            res.send(eventsMap);
        }
    });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT);
//# sourceMappingURL=index.js.map