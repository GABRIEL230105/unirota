const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const database = require("./config/database");
const userRoutes = require("./routes/index.routes");

dotenv.config();
database();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ message: "API funcionando" });
});

app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
