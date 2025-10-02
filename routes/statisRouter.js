import express from 'express'
import {URL} from "../models/url.js"
const router= express.Router();

router.get("/" , async(req,res) =>{
    try{
        const urls=await URL.find();
        return res.render("home" , {urls:urls})
    }
    catch(error)
    {
        return res.status(500).render("home",{
            error:"Failed to load URLS",
            urls:[]
        })

    }
})

export default router
