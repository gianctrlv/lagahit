const express = require("express");
const app = express();
const { createUserTable } = require("./models/auth-model");

// Parse JSON body
app.use(express.json());

// Create table when server starts
createUserTable()
  .then(() => console.log("User table has been created"))
  .catch((error) => console.log(error));

// Routes
app.use("/api/auth", require("./routes/auth-route"));

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
