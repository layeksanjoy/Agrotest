const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.MONGODB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
client.connect((err, db) => {
  if (db) console.log("Mongodb connected!");
});

client.on("connect", () => {
  console.log("Mongodb Reconnected!");
});
client.on("close", () => {
  console.log("Mongodb disconnected!");
});
client.on("reconnect", () => {
  console.log("Mongodb Reconnected!");
});
process.on("SIGINT", async () => {
  await client.close();
  process.exit(0);
});

const product = client.db(process.env.DB_NAME).collection("product");

const productCategory = client
  .db(process.env.DB_NAME)
  .collection("product_category");

module.exports = { product, productCategory };
