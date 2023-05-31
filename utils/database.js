import mongoose from "mongoose";
let isConnected = false;

export const connectToDB = async () => {
    mongoose.set('strictQuery', true);
    if (isConnected) {
        console.log("Database is aldready running")
        return;
    }
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'shopit',
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        isConnected = true;
        console.log("Database Connected")
    } catch (error) {
        console.log(error)
    }
}