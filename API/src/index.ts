import express from 'express';
import mongoose from 'mongoose';
import { Stripe } from 'stripe';
import { env } from './config/keys';
import Ticket from './models/Ticket';

const stripe = new Stripe(env.stripeSecretKey, {apiVersion: "2020-08-27"});
// mongoose.connect(env.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.get('/api', (req, res) => {
  console.log("dziala");
  res.send({ jaja: "dupa" });
});

app.get("/api/payment_intent", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 400,
      currency: "pln",
      payment_method_types: ['card'],
      metadata: {integration_check: "accept a payment"},
    });
    res.status(200).send(paymentIntent.client_secret);
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);