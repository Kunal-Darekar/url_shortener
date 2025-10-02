import mongoose  from "mongoose";


async function connectToMongoDB(url)
{
    try{
        await mongoose.connect(url);
        console.log('Mongodb Connected Successfully')

    }catch(error)
    {
        console.error('Error Connecting to MongoDB :' ,error);
        process.exit(1);
    }
    
}

export {connectToMongoDB}