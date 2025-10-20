import express from "express";

const router = express.Router();

router.post("/create-member",(req,res)=>{
    // todo create a member
    res.status(200).send("Member created")
})

export default router;