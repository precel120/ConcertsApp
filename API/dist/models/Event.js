"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const eventSchema = new Schema({
    imageUrl: String,
    nameOfEvent: String,
    dateOfEvent: Date,
    place: String,
    description: String,
});
const Event = mongoose_1.default.model("events", eventSchema);
exports.default = Event;
//# sourceMappingURL=Event.js.map