const { model } = require("mongoose");
const { NewsSchema } = require("../schemas/NewsSchema");

const NewsModel = model("news", NewsSchema);

module.exports = { NewsModel };
