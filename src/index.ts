import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoute";

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("Connect to database."))
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

const app = express();

app.use(express.json());
app.use(cors());

app.get("/health", async (req: Request, res: Response) => {
  res.send({messag: "healt OK!"});
})

app.use("/api/my/user", myUserRoute);

app.listen(5080, () => {
  console.log("server started on localhost:5080");
});
