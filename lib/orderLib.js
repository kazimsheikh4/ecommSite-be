const Order = require("../models/orderModal");

const findOne = async (options) => {
  const order = await Order.findOne(options);

  if (!order) {
    throw new Error("Order not found");
  }
  return order;
};
const findOneAndUpdate = async (query, update, options) => {
  const updatedOrder = await Order.findOneAndUpdate(query, update, options);
  if (!updatedOrder) {
    throw new Error(
      "Order not found or user does not have permission to update it"
    );
  }
  return updatedOrder;
};
module.exports = {
  findOne,
  findOneAndUpdate,
};
