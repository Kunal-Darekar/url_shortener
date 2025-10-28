import mongoose from 'mongoose'


const urlSchema = new mongoose.Schema({
  shortId:{
    type :String,
    required:true,
    unique:true,
  } ,
    redirectURL:{
        type:String,
        required:true
    },
    visitHistory:[{timestamp:{ type:Number}}],
},
{timestamps : true}

);

// Explicit indexes for performance and future expiry support
urlSchema.index({ shortId: 1 }, { unique: true });
urlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, partialFilterExpression: { expiresAt: { $type: "date" } } });

const URL= mongoose.model("url",urlSchema);

export {URL}
