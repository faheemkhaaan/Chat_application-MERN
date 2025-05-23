import mongoose from "mongoose";


const connectDB = async () => {
    if (!process.env.DBLINK) {
        throw new Error("Database link enviroment variable is not defined");
    }
    try {
        await mongoose.connect(process.env.DBLINK, {
            serverSelectionTimeoutMS: 30000, // 30 seconds
            socketTimeoutMS: 75000, // 75 seconds
            family: 4, // Force IPv4
            bufferCommands: false,
            directConnection: true,
        });
        console.log("✅ Database connected successfully");
    } catch (error) {
        console.error("❌ Database connection error:", error);
    }
}


export default connectDB