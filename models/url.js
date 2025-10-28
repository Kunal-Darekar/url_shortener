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
        default: true
    },
    expiresAt: {
        type: Date,
        default: null
    },
    lastAccessed: {
        type: Date,
        default: null
    },
    visitHistory:[{timestamp:{ type:Number}}],
},
{timestamps : true}

);

const URL= mongoose.model("url",urlSchema);

export {URL}
