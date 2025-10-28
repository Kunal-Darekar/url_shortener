import { nanoid } from "nanoid";
import {URL} from  '../models/url.js'

async function handleGenerateNewShortURL(req,res){
    const body=req.body;
    const New_Variable=!body.url;
    if(New_Variable)return res.status(400).json({error:"URL is required"});

    const shortId= body.shortId && String(body.shortId).trim() !== '' ? String(body.shortId).trim() : nanoid(8);
    const payload = {
        shortId :shortId,
        redirectURL: body.url,
        visitHistory:[],
    };
    if(body.expiresAt){
        const d = new Date(body.expiresAt);
        if(!isNaN(d.getTime())){
            payload.expiresAt = d;
        }
    }
    if(typeof body.isActive !== 'undefined'){
        payload.isActive = Boolean(body.isActive);
    }

    await URL.create(payload);

    return  res.render("home",
        { id :shortId});

}
async function handleGetAnalytics(req,res){
    const shortId=req.params.shortId;
    const result = await URL.findOne({shortId});
    return res.json({totalClicks:result.visitHistory.length, 
        analytics: result.visitHistory,
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
