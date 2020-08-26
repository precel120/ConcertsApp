import express from 'express';

const app = express();

app.get('/', () => {
  console.log('działa');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);