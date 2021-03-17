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
const express_1 = require("express");
const Event_1 = __importDefault(require("../models/Event"));
const StatusError_1 = __importDefault(require("../StatusError"));
const Ticket_1 = __importDefault(require("../models/Ticket"));
const eventsRouter = express_1.Router();
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
eventsRouter.get("/api/events", (req, res) => {
    Event_1.default.find({}, (error, events) => {
        if (!error) {
            return res.status(200).send(events.slice());
        }
        else
            return res.status(404).send("Couldn't find events");
    });
});
//Get for how many tickets are left,NOT get for event by id
eventsRouter.get("/api/events/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.default = eventsRouter;
//# sourceMappingURL=events.js.map