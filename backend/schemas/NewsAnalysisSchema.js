const { Schema, Types } = require("mongoose");

const NewsAnalysisSchema = new Schema(
  {
    newsId: {
      type: Types.ObjectId,
      ref: "news",
      required: true,
      unique: true,
      index: true,
    },
    symbol: { type: String, default: null, index: true },
    sentiment: {
      type: String,
      enum: ["Positive", "Neutral", "Negative"],
      required: true,
    },
    impact: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },
    direction: {
      type: String,
      enum: ["Bullish", "Neutral", "Bearish"],
      required: true,
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    timeHorizon: {
      type: String,
      enum: ["Short Term", "Medium Term", "Long Term"],
      required: true,
    },
    summary: { type: String, required: true },
    reasoning: { type: String, required: true },
    keyFactors: [{ type: String }],
    model: { type: String, default: "tradesphere-ai" },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

NewsAnalysisSchema.index({ symbol: 1, createdAt: -1 });

module.exports = { NewsAnalysisSchema };
