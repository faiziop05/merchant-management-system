const express = require("express");
const { verifyToken } = require("../middlewhere/authMiddleware");
const { addMerchant, getMerchantById, getMerchants } = require("../contollers/MerchantContoller");
const router = express.Router();

router.post("/add-merchant", verifyToken, addMerchant);
router.post("/get-merchant/:id", verifyToken, getMerchantById);
router.post("/get-merchants", verifyToken, getMerchants);

module.exports = router;
