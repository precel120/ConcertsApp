"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ticketSchema = new mongoose_1.Schema({
    email: String,
    firstName: String,
    lastName: String,
    phoneNumber: String,
    eventId: String,
    purchaseDate: Date,
});
const Ticket = mongoose_1.model("tickets", ticketSchema);
exports.default = Ticket;
//# sourceMappingURL=Ticket.js.map