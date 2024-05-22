const dotenv = require("dotenv").config();
const express = require("express");
const moongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoute = require("./routes/userRoute");
const errorHandler = require("./middleWare/errorMiddleware");
const cookieParser = require("cookie-parser");

const app = express();

// middlewares

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Chat-GPT
// CORS Middleware
app.use(cors()); // Allow all origins. For production, you may want to configure CORS options.
// app.use(
//   cors({
//     origin: ["https://fyp-back.vercel.app/"],
//     methods: ["POST", "GET"],
//     credentials: true,
//   })
// );

// Routes Middleware
app.use("/api/users", userRoute);

// routes
app.get("/", (req, res) => {
  res.send("HomePage");
});

const PORT = process.env.PORT || 5000;

// error Middleware
app.use(errorHandler);

//Connect to MongoDB and start server
moongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
