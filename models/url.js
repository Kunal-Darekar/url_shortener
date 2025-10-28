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
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    expiresAt: {
        type: Date,
        default: null,
        index: true
    },
    lastAccessed: {
        type: Date,
        default: null
    },
    visitHistory:[{timestamp:{ type:Number}}],
},
{timestamps : true}

);

// TTL index for automatic expiration when expiresAt is set
// MongoDB will delete documents when current time > expiresAt
// Only applies to documents where expiresAt is a valid Date
urlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, partialFilterExpression: { expiresAt: { $type: "date" } } });

// Performance index for shortId lookups
urlSchema.index({ shortId: 1 }, { unique: true });

const URL= mongoose.model("url",urlSchema);

export {URL}
