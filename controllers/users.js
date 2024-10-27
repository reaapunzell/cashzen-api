import express from 'express'
const router = express.Router()
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import User from "../model/User.js"

const SALT = Number(process.env.SALT)
const JWT_KEY = process.env.JWT_KEY

router.post('/register', async (req, res)=>{
    try{
        const { username, email, password} = req.body
        const newUser = new User({
            username,
            email,
            password:bcrypt.hashSync(password, SALT),
        })
        await newUser.save()
        res.send(`new user ${req.body.username} created`)
    } catch (err){
        console.log(err)
        res.status(500).send(err)
    }
})

router.post("/login" ,  async (req, res)=>{
    try{
        const { username, password} = req.body;
        console.log(`attempting to log in user: ${username}`);
        const user = await User.findOne({ username})

        if (!user){
            console.log("Unknown username");
            return res.status(401).json({ message: 'Unknown username' });
        }else{
            const verified = await bcrypt.compare(password, user.password)
            if (!verified){
                console.log("Incorrect password");
            return res.status(401).json({ message: 'Incorrect password' });
            } else {
                
                const token = jwt.sign({userId: user._id}, JWT_KEY, {
                    expiresIn: 60 * 60 * 24,
                })
                res.json({message: 'user verified', token, user})
            }
        }
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
})

export default router