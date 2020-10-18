"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const ticketSchema = new Schema({
    email: String,
    firstName: String,
    lastName: String,
    phoneNumber: Number,
    eventId: String,
    purchaseDate: Date,
});
const Ticket = mongoose_1.default.model("tickets", ticketSchema);
exports.default = Ticket;
//# sourceMappingURL=Ticket.js.map