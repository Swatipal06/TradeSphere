const { model } = require("mongoose");

const { HoldingsSchema } = require("../schemas/HoldingsSchemas");

const HoldingsModel = model("holding", HoldingsSchema);

module.exports = { HoldingsModel };