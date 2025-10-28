import express, { urlencoded } from 'express';
import { connectToMongoDB } from './connect.js';
import urlRoute from './routes/url.js';
import path from "path";
import dotenv from "dotenv";
import { URL } from './models/url.js';
import staticRoute from "./routes/statisRouter.js"


dotenv.config()
const app=express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine" , "ejs");
app.set("views" ,path.resolve ('./views'));
const PORT=8001;

app.get("/test" , async (req,res)=>{
    const urls=await URL.find();
return res.render("home",{
    urls:urls
})
})
connectToMongoDB(process.env.MONGODB_URL)
app.use('/url',urlRoute);

app.use("/" , staticRoute);
app.use('/:shortId', async(req,res , next)=>{
    try{
    const shortId=req.params.shortId;
    const entry = await URL.findOne({ shortId });

if(!entry)
{
    return res.status(400).json({error: "Short URL not Found !"});
}

if(entry.isActive === false){
    return res.status(410).json({error: "Link is deactivated"});
}
if(entry.expiresAt && entry.expiresAt.getTime() <= Date.now()){
    return res.status(410).json({error: "Link has expired"});
}

await URL.updateOne({ _id: entry._id }, {
    $push: { visitHistory: { timestamp: Date.now() } },
    $set: { lastAccessed: new Date() }
});
return res.redirect(entry.redirectURL)
    }catch(err)
    {
        next(err);
    }

});

// app.use("/" , async(req, res,next)=>{
//     try{

//         const result= await URL.find();

//         res.status(200).json(result);
//     }
//     catch(error)
//     {
//         res.status(500).json({msg:error.message()})
//     }
// });

//Global Error handler
app.use((err, req , res, next)=>{
    console.error(err);
    res.status(500).json({error:"Internal Server Error"});
});
app.listen(PORT, ()=> console.log(`Server is Running on  PORT ${PORT}`));

