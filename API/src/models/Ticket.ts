import mongoose from 'mongoose';

const { Schema } = mongoose;

const ticketSchema = new Schema({
    firstName: String,
    lastName: String,
    eventId: String,
    purchaseDate: Date,
});

mongoose.model('tickets', ticketSchema);
