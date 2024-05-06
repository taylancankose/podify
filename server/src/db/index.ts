import mongoose from "mongoose";
import { MONGO_URI } from "#/utils/variables";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("DB connection established");
  })
  .catch((err) => {
    console.log("Error connecting to Mongoose database", err);
  });
