export default {
  mongoURI: process.env.MONGO_URI!,
  stripePublishibleKey: process.env.STRIPE_PUBLISHIBLE_KEY!,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY!,
  email: process.env.EMAIL!,
  emailPassword: process.env.EMAIL_PASSWORD!,
  mainURL: process.env.MAIN_URL!,
  TOKEN_SECRET: process.env.TOKEN_SECRET!
};
