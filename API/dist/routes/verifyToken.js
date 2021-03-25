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
const jsonwebtoken_1 = require("jsonwebtoken");
const StatusError_1 = __importDefault(require("../StatusError"));
const keys_1 = require("../config/keys");
const User_1 = __importDefault(require("../models/User"));
const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        let err = new StatusError_1.default("Access Denied", 401);
        return next(err);
    }
    jsonwebtoken_1.verify(token, keys_1.env.TOKEN_SECRET, (err) => {
        if (err) {
            return next(err);
        }
        else {
            next();
        }
    });
};
const checkCurrentUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        res.locals.user = null;
        let err = new StatusError_1.default("Access Denied", 401);
        return next(err);
    }
    jsonwebtoken_1.verify(token, keys_1.env.TOKEN_SECRET, (err, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return next(err);
        }
        else {
            let user = yield User_1.default.findById(decodedToken.id);
            res.locals.user = user;
            return next();
        }
    }));
};
exports.default = { verifyToken, checkCurrentUser };
//# sourceMappingURL=verifyToken.js.map