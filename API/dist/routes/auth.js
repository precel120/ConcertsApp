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
const express_validator_1 = require("express-validator");
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const User_1 = __importDefault(require("../models/User"));
const StatusError_1 = __importDefault(require("../StatusError"));
const keys_1 = require("../config/keys");
const authRouter = express_1.Router();
authRouter.post("/register", [
    express_validator_1.body("email").trim().isEmail().isLength({ min: 8 }).normalizeEmail(),
    express_validator_1.body("password")
        .trim()
        .isString()
        .isLength({ min: 2 })
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
    express_validator_1.body("firstName")
        .trim()
        .isString()
        .isLength({ min: 2 })
        .matches(/^[^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/),
    express_validator_1.body("lastName")
        .trim()
        .isString()
        .isLength({ min: 2 })
        .matches(/^[^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/),
    express_validator_1.body("phoneNumber")
        .trim()
        .isString()
        .isLength({ min: 8 })
        .matches(/^((?<!\w)(\(?(\+|00)?48\)?)?[ -]?\d{3}[ -]?\d{3}[ -]?\d{3}(?!\w))$/),
], (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        let err = new StatusError_1.default("Error while validating body", 400);
        return next(err);
    }
    const { email, password, firstName, lastName, phoneNumber } = req.body;
    //Check if user already in DB
    const emailExists = yield User_1.default.findOne({ email: req.body.email });
    if (emailExists) {
        let err = new StatusError_1.default("Email already exists", 400);
        return next(err);
    }
    try {
        //Hash passwd
        const salt = yield bcryptjs_1.genSalt(10);
        const hashedPassword = yield bcryptjs_1.hash(password, salt);
        //Create new user
        const user = new User_1.default({
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            orders: [],
        });
        const userSaved = yield user.save();
        res.status(200).send(userSaved);
    }
    catch (err) {
        next(err);
    }
}));
authRouter.post("/login", [
    express_validator_1.body("email").trim().isEmail().isLength({ min: 8 }).normalizeEmail(),
    express_validator_1.body("password")
        .trim()
        .isString()
        .isLength({ min: 4 })
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
], (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        let err = new StatusError_1.default("Error while validating body", 400);
        return next(err);
    }
    const user = yield User_1.default.findOne({ email: req.body.email });
    if (!user) {
        let err = new StatusError_1.default("Email not found", 400);
        return next(err);
    }
    const validPasswd = yield bcryptjs_1.compare(req.body.password, user.password);
    if (!validPasswd) {
        let err = new StatusError_1.default("Invalid password", 400);
        return next(err);
    }
    //Create JWT
    const token = jsonwebtoken_1.sign({ _id: user._id }, keys_1.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
}));
exports.default = authRouter;
//# sourceMappingURL=auth.js.map