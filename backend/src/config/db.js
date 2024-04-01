const { MongoClient } = require("mongodb");

const url = process.env.DB_URI;
const dbName = process.env.DB_NAME;

const client = new MongoClient(url);

async function connectToDatabase() {
  await client.connect();
  console.log("Connected to MongoDB");
  return client.db(dbName);
}

module.exports = { connectToDatabase };
