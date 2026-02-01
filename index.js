require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

const adminAuth = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Static & views
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// Routes
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

app.use("/students", adminAuth, require("./routes/students"));
app.use("/courses", adminAuth, require("./routes/courses"));
app.use("/enrollments", adminAuth, require("./routes/enrollments"));

app.get("/", adminAuth, (req, res) => {
  res.render("admin");
});

app.get("/health", (req, res) => {
  res.send("OK");
});

// MongoDB + Server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error("MongoDB connection error:", err));
