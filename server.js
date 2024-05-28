const express = require("express");
const dotenv = require("dotenv").config();
const productRoutes = require("./routes/productRoutes");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");

connectDb();
const app = express();

const port = process.env.PORT || 3000;

// app.get("/api/contacts", (req, res) => {
//   res.status(200).json({message: "all clients"});
// });
app.use(express.json());
app.use("/api/products", productRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
