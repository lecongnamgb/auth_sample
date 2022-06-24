require("dotenv").config();
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const route = require("./routes");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 5000;

const app = express();
const originArr = ["http://localhost:3000"];
const originStr = originArr.join(",");

app.use(cors({ origin: originStr, credentials: true }));
app.use(cookieParser());
app.use(bodyParser.json());

connectDB();
route(app);

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
