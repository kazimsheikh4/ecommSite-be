const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    order_date: {
      type: Date,
      required: ["true", "Please add the order date"],
    },
    total_amount: {
      type: Number,
      required: ["true", "Please add the total amount"],
    },
    status: {
      type: String,
      required: ["true", "Please add the status of order"],
      enum: ["pending", "shipped", "delivered", "canceled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
