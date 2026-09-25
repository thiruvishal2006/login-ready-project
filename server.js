require("dotenv").config();
const express = require("express");
const cors = require("cors");

const projectRoutes = require("./routes/projects");

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:3000" }));
app.use(express.json());

app.use("/api/projects", projectRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Backend API running at http://localhost:${port}`));
