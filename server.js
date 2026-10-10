import express from "express";
import dotenv from "dotenv"
import connectDB from "./config/mongoDb.js"
import router from "./routes/routes.js";
import cors from "cors"
dotenv.config();
const app = express();
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))
app.use(express.json());
connectDB();


app.use("/api/admin",router)

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});