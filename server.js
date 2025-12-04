import app from "./app.js";

import mongoose from "mongoose";

const port = process.env.port;

const connection = async () => {
  try {
    await mongoose.connect(process.env.mongoDb);
    console.log("server connect to the MongoDB");
  } catch (err) {
    console.error('An error occurred', err)
  }
};
connection();

app.listen(port, () => {
  console.log(`The server is connected to port,${port}`);
});
