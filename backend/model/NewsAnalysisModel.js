const { model } = require("mongoose");
const { NewsAnalysisSchema } = require("../schemas/NewsAnalysisSchema");

const NewsAnalysisModel = model("news_analysis", NewsAnalysisSchema);

module.exports = { NewsAnalysisModel };
