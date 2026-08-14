const { Schema, Types } = require("mongoose");

const OrdersSchema = new Schema({
    userId: { type: Types.ObjectId, ref: "user", required: true, index: true },
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
    mode: { type: String, default: "BUY" }, // BUY or SELL
    product: { type: String, default: "CNC" }, // CNC or MIS
    status: { type: String, default: "COMPLETE" },
    createdAt: { type: Date, default: Date.now },
});

module.exports = { OrdersSchema };