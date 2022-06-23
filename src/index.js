require("dotenv").config();
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const route = require("./routes");
const { connectDB } = require("./config/database");
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 5000;

console.log(process.env.ACCESS_TOKEN_SECRET);
const app = express();

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());

connectDB();
route(app);

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
