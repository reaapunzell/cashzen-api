import "dotenv/config"
import express from 'express';
import cors from 'cors';
import { dbConnect } from "./db.js";

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

console.log(process.env.ANYTHING)

app.use(cors());
app.use(express.json())


import router from "./controllers/users.js"
import transactionsRouter from "./controllers/transactions.js"
app.use('/auth', router)
app.use("/transactions", transactionsRouter)

app.get('/', (req,res) => {
    res.send("hello world");
})


app.listen(PORT, () =>{
    dbConnect()
    console.log(`[server]: listening on port  ${PORT}`)
})