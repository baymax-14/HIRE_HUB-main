import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import { seedDefaultData } from "./seedData.js";

let mongoServer;

const connectDb = async () => {
    const uri = process.env.MONOGOURL || "mongodb://127.0.0.1:27017/hirehub";
    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 8000,
        });
        console.log("Database connected successfully to MongoDB Atlas / URI");
        await seedDefaultData();
    } catch (error) {
        console.error("Could not connect to MongoDB URI:", error.message);
        // In development only: fallback to MongoMemoryServer
        if (process.env.NODE_ENV !== "production") {
            try {
                console.log("Attempting local in-memory MongoDB fallback...");
                const { MongoMemoryServer } = await import("mongodb-memory-server");
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
                mongoose.set('bufferCommands', true);
                await mongoose.connect(mongoUri);
                console.log("Connected successfully to persistent local MongoDB at:", mongoUri);
                await seedDefaultData();
            } catch (memErr) {
                console.error("Failed to start local in-memory MongoDB:", memErr.message);
            }
        }
    }
};

export default connectDb;