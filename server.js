import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors"; // Import CORS
import productRoutes from "./routes/product.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Database Connection
async function connectDB() {
  if (process.env.NODE_ENV === "test") {
    // Skip MongoDB connection if in test environment
    console.log("Skipping MongoDB connection in test environment.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    // Perform a simple database operation to check database health.
    await mongoose.connection.db.admin().ping();
    res.status(200).json({
      status: "UP",
      message: "App is running smoothly. - le bon developpeur ",
      database: "Connected",
    });
  } catch (err) {
    res.status(500).json({
      status: "DOWN",
      message: "App or Database is experiencing issues.",
      database: "Disconnected",
    });
  }
});


app.use("/api/products", productRoutes);

// Start Server only if not in test environment
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
  });
}

export { app };  // Export app for testing
