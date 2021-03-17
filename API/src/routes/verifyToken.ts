import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import StatusError from "../StatusError";
import { env } from "../config/keys";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("auth-token");
  if (!token) {
    let err = new StatusError("Access Denied", 401);
    return next(err);
  }
  try {
    const verified = verify(token, env.TOKEN_SECRET);
    req.user = verified;
  } catch (err) {
    next(err);
  }
};

export default verifyToken;
