import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import StatusError from "../StatusError";
import { env } from "../config/keys";
import User from "../models/User";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;
  if (!token) {
    let err = new StatusError("Access Denied", 401);
    return next(err);
  }
  verify(token, env.TOKEN_SECRET, (err: any) => {
    if (err) {
      return next(err);
    } else {
      next();
    }
  });
};

const checkCurrentUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;
  if (!token) {
    res.locals.user = null;
    let err = new StatusError("Access Denied", 401);
    return next(err);
  }
  verify(token, env.TOKEN_SECRET, async (err: any, decodedToken: any) => {
    if (err) {
      return next(err);
    } else {
      let user = await User.findById(decodedToken.id);
      res.locals.user = user;
      return next();
    }
  });
};

export default {verifyToken, checkCurrentUser};
