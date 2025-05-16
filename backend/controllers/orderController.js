//learn to use B hooks to cancel order if payment is unsuccessful.

import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(
  "sk_test_51Pue0T03gkpmcZw2xcDKsPtsOIs3ptG2mCosHsCkqhrnqiqSssTu5iKMPAXap3XvEPw08Cz4Su6wYOgGBfFxNrqY00wYvAo48T"
);

//placing user order from frontend
const placeOrder = async (req, res) => {
  const frontend_url = "http://16.171.54.54:3000";

  try {
    //for saving order data to database
    const newOrder = new orderModel({
      userId: req.body.userId, //added by middleware
      items: req.body.items,
      amount: req.body.amount, //price + dc -> total amount of all items
      address: req.body.address,
    });
    await newOrder.save();
    //updating cart after order
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    //Code for stripe payment
    //line_items -> creatig a separate object for each item ordered and storing in array
    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "pkr",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100 * 270, //dollar price
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "pkr",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 2 * 100 * 270, //as dc is 2
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const verifyOrder = async (req, res) => {
  //should be done using b hooks
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//user's orders for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//listing all orders for admin
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//update status of order by admin
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({ success: true, message: "Status updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
