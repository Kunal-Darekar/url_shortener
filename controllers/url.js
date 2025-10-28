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
        // Validate
        // eslint-disable-next-line no-new
        new URL(destination);
    }catch(err){
        return res.status(400).json({error:"Invalid URL"});
    }

    // Optional custom alias; fallback to generated id
    let shortId = (body.shortId || "").trim();
    if(shortId === ""){
        shortId = nanoid(8);
    }

    // Optional expiry
    let expiresAt = null;
    if(body.expiresAt){
        const parsed = new Date(body.expiresAt);
        if(isNaN(parsed.getTime())){
            return res.status(400).json({error:"Invalid expiresAt date"});
        }
        if(parsed.getTime() <= Date.now()){
            return res.status(400).json({error:"expiresAt must be in the future"});
        }
        expiresAt = parsed;
    }

    // Optional isActive flag
    const isActive = body.isActive === undefined ? true : Boolean(body.isActive);

    try{
        const created = await URL.create({
            shortId,
            redirectURL: destination,
            isActive,
            expiresAt,
            visitHistory:[],
        });

        // If EJS view expects id only, keep same shape
        return res.render("home", { id: created.shortId });
    }catch(err){
        if(err && err.code === 11000){
            return res.status(409).json({error:"shortId already exists"});
        }
        return res.status(500).json({error:"Failed to create short URL"});
    }
}
async function handleGetAnalytics(req,res){
    const shortId=req.params.shortId;
    const result = await URL.findOne({shortId});
    if(!result){
        return res.status(404).json({error:"Not found"});
    }
    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
        isActive: result.isActive,
        expiresAt: result.expiresAt,
        lastAccessed: result.lastAccessed,
        createdAt: result.createdAt,
        redirectURL: result.redirectURL,
    });


}
async function getallurl(req,res){
    try{
    const result= await URL.find().sort({ createdAt: -1 }).limit(100);
    return res.status(200).json({ count: result.length, urls: result });
    }catch(error)
    {
        res.status(500).json({ error: 'Failed to fetch URLs' });
    }
}

    export {handleGenerateNewShortURL , handleGetAnalytics , getallurl};
