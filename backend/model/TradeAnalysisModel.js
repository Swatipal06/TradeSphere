const { model } = require("mongoose");
const { TradeAnalysisSchema } = require("../schemas/TradeAnalysisSchema");

const TradeAnalysisModel = model("trade_analysis", TradeAnalysisSchema);

module.exports = { TradeAnalysisModel };
