"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const prod_1 = __importDefault(require("./prod"));
const dev_1 = __importDefault(require("./dev"));
exports.env = process.env.NODE_ENV === "production" ? prod_1.default : dev_1.default;
//# sourceMappingURL=keys.js.map