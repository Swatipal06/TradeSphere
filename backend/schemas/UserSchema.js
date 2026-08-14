const { Schema } = require("mongoose");

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }, // bcrypt hashed
    funds: {
      availableMargin: { type: Number, default: 100000 },
      usedMargin:      { type: Number, default: 0 },
      availableCash:   { type: Number, default: 100000 },
      payin:           { type: Number, default: 100000 },
      span:            { type: Number, default: 0 },
      deliveryMargin:  { type: Number, default: 0 },
      exposure:        { type: Number, default: 0 },
      optionsPremium:  { type: Number, default: 0 },
      collateralLiquid:{ type: Number, default: 0 },
      collateralEquity:{ type: Number, default: 0 },
      totalCollateral: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = { UserSchema };
