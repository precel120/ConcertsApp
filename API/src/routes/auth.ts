import { Router, Response, Request, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { genSalt, hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import User from "../models/User";
import StatusError from "../StatusError";
import { env } from "../config/keys";

const authRouter = Router();

authRouter.post(
  "/api/register",
  [
    body("email").trim().isEmail().isLength({ min: 8 }).normalizeEmail(),
    body("password")
      .trim()
      .isString()
      .isLength({ min: 2 })
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
    body("firstName")
      .trim()
      .isString()
      .isLength({ min: 2 })
      .matches(/^[^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/),
    body("lastName")
      .trim()
      .isString()
      .isLength({ min: 2 })
      .matches(/^[^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/),
    body("phoneNumber")
      .trim()
      .isString()
      .isLength({ min: 8 })
      .matches(
        /^((?<!\w)(\(?(\+|00)?48\)?)?[ -]?\d{3}[ -]?\d{3}[ -]?\d{3}(?!\w))$/
      ),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let err = new StatusError("Error while validating body", 400);
      return next(err);
    }

    const { email, password, firstName, lastName, phoneNumber } = req.body;

    //Check if user already in DB
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) {
      let err = new StatusError("Email already exists", 400);
      return next(err);
    }

    try {
      //Hash passwd
      const salt = await genSalt(10);
      const hashedPassword = await hash(password, salt);

      //Create new user
      const user = new User({
        email: email,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        orders: [],
      });

      const userSaved = await user.save();
      res.status(201).send(userSaved);
    } catch (err) {
      next(err);
    }
  }
);

authRouter.post(
  "/api/login",
  [
    body("email").trim().isEmail().isLength({ min: 8 }).normalizeEmail(),
    body("password")
      .trim()
      .isString()
      .isLength({ min: 4 })
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let err = new StatusError("Error while validating body", 400);
      return next(err);
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      let err = new StatusError("Email not found", 400);
      return next(err);
    }
    const validPasswd = await compare(req.body.password, user.password);
    if (!validPasswd) {
      let err = new StatusError("Invalid password", 400);
      return next(err);
    }
    //Create JWT
    const maxAge = 3 * 24 * 60 * 60;
    const token = sign({ _id: user._id }, env.TOKEN_SECRET, {
      expiresIn: maxAge,
    });
    res.cookie("jwt", token, { maxAge: maxAge * 1000 });

    res.status(200).json({ user: user._id });
  }
);

authRouter.get(
  "/api/logout",
  (req: Request, res: Response, next: NextFunction) => {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).send("git");
  }
);

export default authRouter;
