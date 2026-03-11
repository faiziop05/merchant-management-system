const { readData, saveData } = require("../utils/database");

const addMerchant = async (req, res) => {
  try {
    const { name, category, city, contactEmail, country } = req.body;

    if (!name || !category || !city || !contactEmail || !country) {
      return res.status(400).json({
        message:
          "Please provide name, category, city, contactEmail and country.",
      });
    }

    const allMerchants = readData("merchants");

    if (allMerchants.some((m) => m.contactEmail === contactEmail)) {
      return res
        .status(400)
        .json({ message: "A merchant with this email already exists." });
    }

    const newMerchant = {
      id: Date.now().toString().concat("mer"),
      name,
      category,
      city,
      country,
      contactEmail,
      status: "Pending KYB",
      documents: {
        businessRegistration: { uploaded: false, verified: false },
        ownerId: { uploaded: false, verified: false },
        bankProof: { uploaded: false, verified: false },
      },
      createdAt: new Date().toISOString(),
    };

    allMerchants.push(newMerchant);
    saveData("merchants", allMerchants);

    return res.status(201).json({
      message: "Merchant added successfully",
      merchant: newMerchant,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const getMerchantById = async (req, res) => {
  try {
    const { id } = req.params;

    const allMerchants = readData("merchants");
    const merchant = allMerchants.find((m) => m.id === id);

    if (!merchant) {
      return res.status(404).json({ message: "Merchant not found." });
    }

    return res.status(200).json({
      message: "Merchant retrieved successfully",
      merchant: merchant,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const getMerchants = async (req, res) => {
  try {
    const filters = req.query;
    const allMerchants = readData("merchants");

    const filteredMerchants = allMerchants.filter((merchant) => {
      let isMatch = true;
      if (
        filters.name &&
        merchant.name.toLowerCase() !== filters.name.toLowerCase()
      ) {
        isMatch = false;
      }
      if (filters.category && merchant.category !== filters.category) {
        isMatch = false;
      }
      if (filters.city && merchant.city !== filters.city) {
        isMatch = false;
      }
      if (filters.country && merchant.country !== filters.country) {
        isMatch = false;
      }
      if (
        filters.contactEmail &&
        merchant.contactEmail !== filters.contactEmail
      ) {
        isMatch = false;
      }
      if (filters.status && merchant.status !== filters.status) {
        isMatch = false;
      }
      return isMatch;
    });

    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedMerchants = filteredMerchants.slice(startIndex, endIndex);

    const totalPages = Math.ceil(filteredMerchants.length / limit);

    return res.status(200).json({
      message: "Merchants retrieved successfully",
      count: paginatedMerchants.length,
      totalItems: filteredMerchants.length,
      totalPages: totalPages,
      currentPage: page,
      merchants: paginatedMerchants,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const editMerchantDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, city, country, contactEmail } = req.body;

    const allMerchants = readData("merchants");
    const userIndex = allMerchants.findIndex((e) => e.id === id);

    if (userIndex === -1) {
      return res.status(404).json({ message: "Merchant not found." });
    }

    let merchant = allMerchants[userIndex];

    if (name) merchant.name = name;
    if (category) merchant.category = category;
    if (city) merchant.city = city;
    if (country) merchant.country = country;
    if (contactEmail) merchant.contactEmail = contactEmail;

    allMerchants[userIndex] = merchant;
    saveData("merchants", allMerchants);

    return res.status(200).json({
      message: "Merchant updated successfully",
      merchant: merchant,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  addMerchant,
  getMerchants,
  getMerchantById,
  editMerchantDetails,
};
