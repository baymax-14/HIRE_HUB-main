import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import path from "path";
import fs from "fs";
import { seedDefaultData } from "./seedData.js";

let mongoServer;

const connectDb = async () => {
    try {
        const uri = process.env.MONOGOURL || "mongodb://127.0.0.1:27017/hirehub";
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 2000,
        });
        console.log("Database connected successfully to:", uri);
        await seedDefaultData();
    } catch (error) {
        console.log("Local MongoDB not running. Starting persistent MongoDB server fallback on disk...");
        try {
            const dbDir = path.resolve(process.cwd(), "data", "db");
            if (!fs.existsSync(dbDir)) {
                fs.mkdirSync(dbDir, { recursive: true });
            }

            mongoServer = await MongoMemoryServer.create({
                instance: {
                    dbPath: dbDir,
                    dbName: "hirehub"
                }
            });
            const mongoUri = mongoServer.getUri("hirehub");
            // Re-enable bufferCommands for seamless operations
            mongoose.set('bufferCommands', true);
            await mongoose.connect(mongoUri);
            console.log("Connected successfully to persistent MongoDB at:", mongoUri);
            console.log("All signup accounts, jobs, and resumes are saved to:", dbDir);
            await seedDefaultData();
        } catch (memErr) {
            console.error("Failed to start persistent MongoDB:", memErr.message);
        }
    }
};

export default connectDb;