const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const { createUserTable } = require("./models/auth-model");

// Parse JSON and cookies
app.use(express.json());
app.use(cookieParser());

// Create table when server starts
createUserTable()
  .then(() => console.log("User table has been created"))
  .catch((error) => console.log(error));

// Routes
app.use("/api/auth", require("./routes/auth-route"));

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
