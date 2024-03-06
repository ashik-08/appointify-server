const { default: axios } = require("axios");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const globals = require("node-global-storage");
const { v4: uuidv4 } = require("uuid");
const paymentSchema = require("../models/paymentSchema");
const payment = new mongoose.model("payment", paymentSchema);

const bkash_header = async () => {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    authorization: globals.get("id_token"),
    "x-app-key": process.env.bkash_api_key,
  };
};

router.post("/payment/create", async (req, res) => {
  try {
    const { amount, email } = req.body;
    globals.set("email", email);
    const { data } = await axios.post(
      process.env.bkash_create_payment_url,
      {
        mode: "0011",
        payerReference: " ",
        callbackURL: `${process.env.server_url}/bkash/payment/callback`,
        amount: amount,
        currency: "BDT",
        intent: "sale",
        merchantInvoiceNumber: "Inv" + uuidv4().substring(0, 5),
      },
      {
        headers: await bkash_header(),
      }
    );
    // console.log(data);
    return res.status(200).json({ bkashURL: data.bkashURL });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.get("/payment/callback", async (req, res) => {
  const { paymentID, status } = req.query;
  //   console.log(req.query);

  if (status === "cancel" || status === "failure") {
    return res.redirect(
      process.env.frontend_url + `/errorpayment?message=${status}`
    );
  }
  if (status === "success") {
    try {
      const { data } = await axios.post(
        process.env.bkash_execute_payment_url,
        { paymentID },
        {
          headers: await bkash_header(),
        }
      );
      //after successful payment
      if (data && data.statusCode === "0000") {
        const email = globals.get("email");
        const paymentData = new payment({
          email,
          paymentID,
          trxID: data.trxID,
          date: data.paymentExecuteTime,
          amount: parseInt(data.amount),
        });
        console.log(paymentData);
        await paymentData.save();
        return res.redirect(`${process.env.frontend_url}/successpayment`);      
      } else {
        return res.redirect(
          `${process.env.frontend_url}/errorpayment?message=${data.statusMessage}`
        );
      }
    } catch (error) {
      console.log(error);
      return res.redirect(`${process.env.frontend_url}/errorpayment`);
    }
  }
});

module.exports = router;
