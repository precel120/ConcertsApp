import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
    email: String,
    login: String,
    password: String,
    firstName: String,
    lastName: String,
    phoneNumber: String,
    orders: Array
});

const User = mongoose.model("users", userSchema);
export default User;
