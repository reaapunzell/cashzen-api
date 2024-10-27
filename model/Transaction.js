import { mongoose } from "../db.js"

const Transaction = new mongoose.Schema({
    date: {
      type:Date,
      required: true,
      default: Date.now,
    },
    amount:{
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      enum: ['income', 'expense'],
      required:true
    },
    createdBy: {
        type:mongoose.Schema.ObjectId,
        required: true,
        ref: "user",
    }
});
export default mongoose.model("Transaction", Transaction)
