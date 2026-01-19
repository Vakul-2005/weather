import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import weatherRoutes from "./routes/weather.route.js";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());

// ✅ MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

// ✅ ROUTE MOUNT (VERY IMPORTANT)
app.use("/api/weather", weatherRoutes);


app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET"],
  allowedHeaders: ["Content-Type"],
}));


// ✅ Root test route (ADD THIS)
app.get("/", (req, res) => {
  res.send("Backend running");
});

const PORT=5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});

