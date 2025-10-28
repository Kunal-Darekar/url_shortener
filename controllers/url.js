import { nanoid } from "nanoid";
import {URL} from  '../models/url.js'

async function handleGenerateNewShortURL(req,res){
    const body=req.body;
    const isMissingUrl=!body.url;
    if(isMissingUrl)return res.status(400).json({error:"URL is required"});

    // Basic URL validation and normalization
    let destination = String(body.url).trim();
    if(!/^https?:\/\//i.test(destination)){
        destination = `http://${destination}`;
    }
    try{
        // eslint-disable-next-line no-new
        new URL(destination);
    }catch(err){
        return res.status(400).json({error:"Invalid URL"});
    }

    const shortId= nanoid(8);
    await URL.create({
        shortId :shortId,
        redirectURL: destination,
        visitHistory:[],

    });

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
