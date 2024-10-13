const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const globalError = require("./middlewares/errorhandler");
dotenv.config({ path: "./config/config.env" });
const connDb = require("./config/db");
const reportRoute = require("./routes/reportRoute");
const suggRoute = require("./routes/suggestionRoute");
const noteRoute = require("./routes/noteRoute");
const userRoute = require("./routes/userRoute");
const noteSuggRoute = require("./routes/noteSuggRoute");
const ApiError = require("./utils/apiError");
const app = express();
const corsOptions = {
  origin: "http://127.0.0.1:5173",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
connDb();
app.use("/api/report", reportRoute);
app.use("/api/sugg", suggRoute);
app.use("/api/note", noteRoute);
app.use("/api/user", userRoute);
app.use("/api/note/sugg", noteSuggRoute);
app.use("*", (req, res, next) => {
  next(new ApiError("this route not found", 404));
});

app.use(globalError);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/clients/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "clients", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Api is running...");
  });
}
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server running at port ${PORT}...`);
});
