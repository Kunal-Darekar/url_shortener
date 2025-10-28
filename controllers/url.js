import { nanoid } from "nanoid";
import {URL} from  '../models/url.js'

async function handleGenerateNewShortURL(req,res){
    const body=req.body;
    const New_Variable=!body.url;
    if(New_Variable)return res.status(400).json({error:"URL is required"});

    const shortId= nanoid(8);
    await URL.create({
        shortId :shortId,
        redirectURL: body.url,
        visitHistory:[],

    });

    return  res.render("home",
        { id :shortId});

}
async function handleGetAnalytics(req,res){
    const shortId=req.params.shortId;
    const result = await URL.findOne({shortId});
    if(!result){
        return res.status(404).json({error:"Not found"});
    }
    return res.json({totalClicks:result.visitHistory.length, 
        analytics: result.visitHistory,
        isActive: result.isActive,
        expiresAt: result.expiresAt,
        lastAccessed: result.lastAccessed,
        redirectURL: result.redirectURL,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
    });


}
async function getallurl(req,res){
    try{
    const result= await URL.find();
    return res.status(200).json(result);
    }catch(error)
    {
        res.status(500).json({msg : error.message()});
    }
}

    export {handleGenerateNewShortURL , handleGetAnalytics , getallurl};
