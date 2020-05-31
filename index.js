const express = require("express");
const parser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());
app.use(express.static("client/build"));

const AppRoutes = require("./appRoutes/AppRoutes");

app.use("/", AppRoutes);

app.set("port", process.env.PORT || process.env.INSTAPORT);

app.listen(app.get("port"), () => {
    console.log("Server listening on port " + app.get("port"));
});
