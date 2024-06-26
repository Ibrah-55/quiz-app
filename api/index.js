import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import { connectToDatabase } from "./src/connection/db.conn.js";
import authRouter from "./src/routes/auth.route.js";
import adminRouter from "./src/routes/admin.route.js";
import userRouter from "./src/routes/user.route.js";
import userRecordRouter from "./src/routes/userRecord.route.js";
import lipaNaMpesaRoutes from "./src/routes/lipanampesa.route.js"

dotenv.config();

connectToDatabase(process.env.MONGO_URI);

const app = express();

const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: ["http://localhost:3000", "https://e940-197-232-245-169.ngrok-free.app"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

app.use(express.json());

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.use("/api", authRouter);
app.use("/api", adminRouter);
app.use("/api", userRouter);
app.use("/api", userRecordRouter);
app.use('/api', lipaNaMpesaRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});
app.use((req, res, next) => {
  console.log('Incoming Request:', req);
  next();
});

app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});


app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
    return err;
  }
  console.log("*".repeat(20), "Server Working","*".repeat(20));

  console.log("Server started on port " + PORT);
});
