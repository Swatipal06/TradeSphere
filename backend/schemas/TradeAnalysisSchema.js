const { Schema, Types } = require("mongoose");

const TradeAnalysisSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    orderId: {
      type: Types.ObjectId,
      ref: "order",
      required: true,
      unique: true,
      index: true,
    },
    symbol: { type: String, required: true, index: true },
    overallAssessment: {
      type: String,
      enum: ["Good", "Average", "Needs Improvement"],
      required: true,
    },
    riskLevel: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },
    whatWentWell: [{ type: String }],
    risks: [{ type: String }],
    whatCouldImprove: [{ type: String }],
    lesson: { type: String, required: true },
    summary: { type: String, required: true },
    newsContext: {
      headline: { type: String, default: null },
      sentiment: { type: String, default: null },
      direction: { type: String, default: null },
      confidence: { type: Number, default: null },
      impact: { type: String, default: null },
      publishedAt: { type: Date, default: null },
    },
    model: { type: String, default: "tradesphere-coach" },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

TradeAnalysisSchema.index({ userId: 1, createdAt: -1 });

module.exports = { TradeAnalysisSchema };
