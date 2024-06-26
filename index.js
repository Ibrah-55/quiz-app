// import express from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import bodyParser from "body-parser";
// import cors from "cors";
// import { connectToDatabase } from "./src/connection/db.conn.js";
// import authRouter from "./src/routes/auth.route.js";
// import adminRouter from "./src/routes/admin.route.js";
// import userRouter from "./src/routes/user.route.js";
// import userRecordRouter from "./src/routes/userRecord.route.js";
// import paymentRouter from "./src/routes/lipanampesa.route.js";

// dotenv.config();

// connectToDatabase(process.env.MONGO_URI);

// const app = express();
// app.use(express.json());

// const PORT = process.env.PORT || 4000;

// app.use(
//   cors({
//     origin: [ "http://localhost:3000"], 
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     credentials: true,
//     optionsSuccessStatus: 204,
//   })
// );

// app.use(cookieParser());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // routes
// app.use("/api", authRouter);
// app.use("/api", adminRouter);
// app.use("/api", userRouter);
// app.use("/api", userRecordRouter);
// app.use("/api", paymentRouter);

// app.get("/", (req, res) => {
//   res.status(200).send("Hello World");
// });


// app.listen(PORT, (err) => {
//   if (err) {
//     console.log(err);
//     return err;
//   }
//   console.log("Server started on port " + PORT);
// });
