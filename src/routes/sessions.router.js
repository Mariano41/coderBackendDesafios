import { Router, json } from "express";
import { userModel } from "../dao/mongo/user.js";

const router = Router();

router.post ('/register', async (req, res)=> {
    const user = await userModel.create(req.body)
    res.status(201).json({status: 'ok', user})
})

router.post ('/login', async (req, res)=> {
    const {email, password } = req.body
    const user = await userModel.findOne({email, password})
    if(!user) return res.status(404).json({ status: "not found", message: "email or password fail!"})
    req.session.user = {
name: `${user.first_name} ${user.last_name}`,
email: user.email,
};

res.status(200).json({status: "ok", user: req.session.user})
})

export default router;