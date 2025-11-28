import app from "./app.js";

import mongoose from "mongoose";

console.log(process.env.DB_user);
const port = process.env.port;

const connection = async () => {
  try {
    await mongoose.connect(process.env.mongoDb);
    console.log("server connect to the MongoDB");
  } catch (err) {
    console.log("server is not connect to MongoDB", err);
  }
};
connection();

app.listen(port, () => {
  console.log(`The server is connected to port,${port}`);
});
