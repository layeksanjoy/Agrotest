const express = require("express");
require("dotenv").config();
const { MongoClient } = require("mongodb");

const app = express();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err, db) => {
  if (db) console.log("Mongodb connected!");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/set-user-data", async (req, res, next) => {
  const { user, time } = req.body;
  const timestamp = new Date(time);
  const data = await client.db("agro").collection("user").insertOne(req.body);
  res.send(data);
});
app.get("/get-today-active", async (req, res, next) => {
  const today = new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString();
  const endOfDay = new Date(
    new Date().setUTCHours(23, 59, 59, 999)
  ).toISOString();
  const data = await client
    .db("agro")
    .collection("user")
    .aggregate([
      {
        $match: {
          time: {
            $gte: today,
            $lt: endOfDay,
          },
        },
      },
      {
        $group: {
          _id: "$user",
          data: { $push: { _id: "$_id", user: "$user", time: "$time" } },
        },
      },
    ])
    .toArray();
  res.send(data);
});

app.get("/get-last-twodays-active", async (req, res, next) => {
  const yesterDay = new Date(
    new Date("2021-10-12T00:00:00.0Z").setUTCHours(0, 0, 0, 0)
  ).toISOString();
  const endOfDay = new Date(
    new Date().setUTCHours(23, 59, 59, 999)
  ).toISOString();
  const data = await client
    .db("agro")
    .collection("user")
    .aggregate([
      {
        $match: {
          time: {
            $gte: yesterDay,
            $lt: endOfDay,
          },
        },
      },
      {
        $group: {
          _id: "$user",
          data: { $push: { _id: "$_id", user: "$user", time: "$time" } },
        },
      },
    ])
    .toArray();
  res.send(data);
});

app.listen(4000, () => {
  console.log("Started");
});
