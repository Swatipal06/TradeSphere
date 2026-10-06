const { Schema } = require("mongoose");

const NewsSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    source: { type: String, default: "Financial Feed" },
    url: { type: String, required: true, unique: true, index: true },
    publishedAt: { type: Date, default: Date.now, index: true },
    symbol: { type: String, default: null, index: true },
    companyName: { type: String, default: null },
    category: { type: String, default: "Market" },
    hasAnalysis: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

NewsSchema.index({ symbol: 1, publishedAt: -1 });

module.exports = { NewsSchema };
