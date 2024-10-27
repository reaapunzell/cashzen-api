import express from 'express';
import { mongoose } from "../db.js";
import tokenValidation from "../middlewares/tokenValidation.js"
import Transaction from '../model/Transaction.js';

const router = express.Router();

router.get("/:userId", tokenValidation, async (req, res) => {
  const userId = req.user._id

  if(!mongoose.Types.ObjectId.isValid(userId)){
    res.status(400).send("Invalid user ID")
  }

  try {
    const userTransactions = await Transaction.find({ createdBy: userId });

    if(userTransactions.length === 0 ){
      res.status(404).send("no transactions found for this user")
    }
    console.log(`fetching ${req.user.username}'s transactions`);
    res.json(userTransactions);
    
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});



router.post("/", tokenValidation, async (req, res) => {
  try {
    const { amount, description, category } = req.body;
    const transaction = new Transaction({
      amount,
      description,
      category,
      createdBy: req.user._id, // geting userId from the validated token
    });
    await transaction.save();
    res.status(201).json({ message: "Transaction added", transaction });    
    console.log(`Transaction saved:`, transaction);
  } catch (err) {
    res.status(500).json({ error: "Failed to add transaction" });
  }
});

export default router