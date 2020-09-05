import express from 'express';
import mongoose from 'mongoose';
import { env } from './config/keys';
import Ticket from './models/Ticket';

mongoose.connect(env.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.get('/api', (res, req) => {
  console.log("dziala");
  req.send({ jaja: "dupa" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);