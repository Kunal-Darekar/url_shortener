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
    
    // Calculate additional analytics
    const visitHistory = result.visitHistory || [];
    const totalClicks = visitHistory.length;
    
    // Calculate clicks per day for the last 7 days
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentVisits = visitHistory.filter(visit => 
        visit.timestamp >= sevenDaysAgo.getTime()
    );
    
    // Group visits by day
    const dailyStats = {};
    recentVisits.forEach(visit => {
        const date = new Date(visit.timestamp).toISOString().split('T')[0];
        dailyStats[date] = (dailyStats[date] || 0) + 1;
    });
    
    // Calculate average daily clicks
    const avgDailyClicks = totalClicks > 0 ? 
        Math.round(totalClicks / ((now - result.createdAt) / (24 * 60 * 60 * 1000))) : 0;
    
    return res.json({
        totalClicks: totalClicks,
        analytics: result.visitHistory,
        dailyStats: dailyStats,
        avgDailyClicks: avgDailyClicks,
        isActive: result.isActive,
        expiresAt: result.expiresAt,
        lastAccessed: result.lastAccessed,
        createdAt: result.createdAt,
        redirectURL: result.redirectURL,
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

async function handleBulkCreateUrls(req, res) {
    const { urls } = req.body;
    
    if (!Array.isArray(urls) || urls.length === 0) {
        return res.status(400).json({
            error: 'urls must be a non-empty array'
        });
    }
    
    if (urls.length > 100) {
        return res.status(400).json({
            error: 'Cannot create more than 100 URLs at once'
        });
    }
    
    try {
        const createdUrls = [];
        const errors = [];
        
        for (let i = 0; i < urls.length; i++) {
            const urlData = urls[i];
            
            try {
                // Basic URL validation and normalization
                let destination = String(urlData.url || '').trim();
                if (!destination) {
                    errors.push({ index: i, error: 'URL is required' });
                    continue;
                }
                
                if (!/^https?:\/\//i.test(destination)) {
                    destination = `http://${destination}`;
                }
                
                // Validate URL
                new URL(destination);
                
                // Optional custom alias
                let shortId = (urlData.shortId || '').trim();
                if (shortId === '') {
                    shortId = nanoid(8);
                }
                
                // Optional expiry
                let expiresAt = null;
                if (urlData.expiresAt) {
                    const parsed = new Date(urlData.expiresAt);
                    if (isNaN(parsed.getTime()) || parsed.getTime() <= Date.now()) {
                        errors.push({ index: i, error: 'Invalid or past expiresAt date' });
                        continue;
                    }
                    expiresAt = parsed;
                }
                
                // Optional isActive flag
                const isActive = urlData.isActive === undefined ? true : Boolean(urlData.isActive);
                
                const created = await URL.create({
                    shortId,
                    redirectURL: destination,
                    isActive,
                    expiresAt,
                    visitHistory: [],
                });
                
                createdUrls.push({
                    index: i,
                    shortId: created.shortId,
                    redirectURL: created.redirectURL
                });
            } catch (err) {
                if (err && err.code === 11000) {
                    errors.push({ index: i, error: 'shortId already exists' });
                } else {
                    errors.push({ index: i, error: err.message });
                }
            }
        }
        
        return res.status(201).json({
            message: `Created ${createdUrls.length} of ${urls.length} URLs`,
            created: createdUrls,
            errors: errors
        });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to create short URLs' });
    }
}

async function handleBulkDeleteUrls(req, res) {
    const { shortIds } = req.body;
    
    if (!Array.isArray(shortIds) || shortIds.length === 0) {
        return res.status(400).json({
            error: 'shortIds must be a non-empty array'
        });
    }
    
    if (shortIds.length > 100) {
        return res.status(400).json({
            error: 'Cannot delete more than 100 URLs at once'
        });
    }
    
    try {
        const result = await URL.deleteMany({
            shortId: { $in: shortIds }
        });
        
        return res.json({
            message: `Deleted ${result.deletedCount} URLs`,
            deletedCount: result.deletedCount
        });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to delete URLs' });
    }
}

    export {handleGenerateNewShortURL , handleGetAnalytics , getallurl, handleBulkCreateUrls, handleBulkDeleteUrls};
