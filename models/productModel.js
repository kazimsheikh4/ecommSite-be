const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: ["true", "Please add the product name"],
    },
    price: {
      type: Number,
      required: ["true", "Please add the product price"],
    },
    size: {
      type: String,
      required: ["true", "Please add the product size"],
    },
    type: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
