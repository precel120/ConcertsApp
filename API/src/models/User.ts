import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    phoneNumber: String,
});

const User = mongoose.model("users", userSchema);
export default User;
