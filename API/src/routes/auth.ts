import { Router, Response, Request } from "express";
import User from "../models/User";

const authRouter = Router();

authRouter.post("/register", async (req: Request, res: Response) => {
  const user = new User({
    email: req.body.email,
    login: req.body.login,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
  });
  try {
    await user.save();
  } catch (err) {
    res.status(400).send(err);
  }
});

export default authRouter;
