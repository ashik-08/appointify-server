const express = require("express");
const router = express.Router();

router.post('/payment/create', async (req, res) => {
    try {
        const data = req.body;
        console.log(data);
        // Process payment creation logic here
        res.status(200).json({
            message: "Payment created successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

module.exports = router;
