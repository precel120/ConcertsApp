"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const userSchema = new Schema({
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    phoneNumber: String,
});
const User = mongoose_1.default.model("users", userSchema);
exports.default = User;
//# sourceMappingURL=User.js.map