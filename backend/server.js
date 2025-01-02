import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config(); // To read the .env file
import helmet from "helmet";
import morgan from "morgan";
import { adminPool, playerPool, developerPool } from "./database.js";
import playerRouter from "./routes/player.js";
import gameRouter from "./routes/game.js";
import reviewRouter from "./routes/reviews.js";
import transactionRouter from "./routes/transaction.js";
import authenticate from "./authentication.js";

const app = express();


const corsOptions = {
    origin: 'http://localhost:3000', // where the frontend is running
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

app.use(cors(corsOptions)); // Cross-Origin Resource Sharing To connect to the server from a different origin
app.use(express.json()); // To parse JSON bodies
app.use(helmet()); // To set secure HTTP headers
// app.use(morgan('combined')); // To log HTTP requests

app.get("/", (req, res, next) => {
    res.status(200).send("Welcome to Gamestorm");
    next();
});


app.use("/player", playerRouter); 

app.use(authenticate); // Apply the authenticate middleware to all the routes in this router

app.use("/game", gameRouter); 
app.use("/reviews", reviewRouter);
app.use("/transaction", transactionRouter);

// db.connect((err) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("Connected to Database");
//     }
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Server listening on Port :", PORT);
})