import express from 'express';
import mongoose from 'mongoose';
import keys from './config/keys';
require('./models/Ticket');

mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.get('/', () => {
  console.log('działa');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);