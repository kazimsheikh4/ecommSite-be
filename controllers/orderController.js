const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModal");
const OrderLib = require("../lib/orderLib");

const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user_id: req.user.id });
  res.status(200).json(orders);
});

// Get orders for the authenticated user with a specific status
// "/orders/status/:status"
const getUserOrdersByStatus = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    user_id: req.user.id,
    status: req.params.status,
  });
  res.status(200).json(orders);
});

// TODO
//Get Orders with a specific status and without status (For admin only)
// "admin/orders/status/:status"
const getOrdersByStatus = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    status: req.params.status,
  });
  res.status(200).json(orders);
});

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find();
  res.status(200).json(orders);
});

const addUserOrder = asyncHandler(async (req, res) => {
  const { order_date, total_amount, status } = req.body;
  if (!order_date || !total_amount || !status) {
    res.sendStatus(400);
    throw new Error("All fields are mandatory!");
  }
  const order = await Order.create({
    order_date,
    total_amount,
    status,
    user_id: req.user.id,
  });
  res.status(201).json(order);
});

//@desc  add a product
//@route POST /api/orders/:id
const getOrderById = asyncHandler(async (req, res) => {
  try {
    const order = await OrderLib.findOne({
      _id: req.params.id,
      user_id: req.user.id,
    });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.Error || "invalid order Id" });
  }
});

//@desc  update a product
//@route PUT /api/orders/:id
const updateOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;

    const updatedOrder = await OrderLib.findOneAndUpdate(
      { _id: orderId, user_id: userId },
      req.body,
      { new: true }
    );

    return res.status(200).json(updatedOrder);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//@desc  Delete a product
//@route Delete /api/orders/:id
//@access public
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User doesn't have permission to update this order");
  }

  await Order.deleteOne({ _id: req.params.id });
  res.status(200).json({ message: "Order deleted successfully" });
});

module.exports = {
  getUserOrders,
  getUserOrdersByStatus,
  getOrdersByStatus,
  getOrders,
  addUserOrder,
  getOrderById,
  updateOrderById,
  deleteOrder,
};
