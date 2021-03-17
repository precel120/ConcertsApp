"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const StatusError_1 = __importDefault(require("../StatusError"));
const keys_1 = require("../config/keys");
const verifyToken = (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
        let err = new StatusError_1.default("Access Denied", 401);
        return next(err);
    }
    try {
        const verified = jsonwebtoken_1.verify(token, keys_1.env.TOKEN_SECRET);
        req.user = verified;
    }
    catch (err) {
        next(err);
    }
};
exports.default = verifyToken;
//# sourceMappingURL=verifyToken.js.map