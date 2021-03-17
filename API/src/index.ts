import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { env } from "./config/keys";
import authRouter from "./routes/auth";
import eventsRouter from "./routes/events";
import ticketsRouter from "./routes/tickets";

mongoose.connect(env.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

//Middlewares
app.use(express.static("public"));
app.use(express.json());
//Routing
app.use(authRouter);
app.use(ticketsRouter);
app.use(eventsRouter);

app.use(function (err: any, req: Request, res: Response) {
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);
