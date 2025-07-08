import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI)
        console.log(`\nMongoDB Connected : ${connectionInstance.connection.host}`);
        return connectionInstance;
    } catch (error) {
        console.log('Error Occured While Connecting to DB', error)
        process.exit(1)
    }
}

export default connectDB;