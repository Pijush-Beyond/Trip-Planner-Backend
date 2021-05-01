import mongoose from "mongoose";
import { readdirSync } from "fs";
import path from "path";
import { config } from "dotenv";
import { log } from "express-errorlog";
config();

const db = {};

const modeldir = path.join(path.resolve('./'), '/src/database/models');
for (let file of readdirSync(modeldir)) {
  const name = path.basename(file).split('.')[0];
  db[name] = async () => {
    const database = await mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const { default: schema } = await import(path.join(modeldir, file));
    return database.model(name, schema)
  };
}

export default db;