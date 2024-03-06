const { default: axios } = require("axios");
const express = require("express");
const router = express.Router();
const globals = require("node-global-storage");
const { v4 : uuidv4} = require("uuid");

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
    const { amount } = req.body;
    const { data } = await axios.post(process.env.bkash_create_payment_url, {
        mode: '0011',
        payerReference: " ",
        callbackURL: process.env.local_server_url,
        amount: amount,
        currency: "BDT",
        intent: 'sale',
        merchantInvoiceNumber: 'Inv' + uuidv4().substring(0,5)
    }, {
        headers: await bkash_header()
    });
    console.log(data);
    // return res.status(200).json({bkashURL:data})
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
