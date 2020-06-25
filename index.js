const express = require("express");
const parser = require("body-parser");
const cors = require("cors");
const app = express();
require('./db/connection')

app.use(cors());
app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());
app.use(express.static("client/build"));

const AppRoutes = require("./routes/AppRoutes");

app.use(AppRoutes)

app.set("port", process.env.PORT || 4000);

app.listen(app.get("port"), () => {
    console.log(`Server running on port ${app.get("port")}`)
});
