"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    userId: String,
    dateOfPurchase: Date,
});
const Order = mongoose_1.model("orders", orderSchema);
exports.default = Order;
//# sourceMappingURL=Order.js.map