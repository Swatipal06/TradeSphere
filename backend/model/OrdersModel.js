const { model } = require("mongoose");

const { OrdersSchema } = require("../schemas/OrdersSchemas");

const OrdersModel = model("order", OrdersSchema);

module.exports = { OrdersModel };