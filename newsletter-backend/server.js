require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(cors());

const userRoutes = require("./routes/user");

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

app.use("/api", userRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
