import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import db from "./database.js";
import playerRouter from "./routes/player.js";
import gameRouter from "./routes/game.js";
import reviewRouter from "./routes/reviews.js";
import transactionRouter from "./routes/transaction.js";

const app = express();

dotenv.config(); // To read the .env file

const corsOptions = {
    origin: 'http://localhost:3000', // where the frontend is running
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

app.use(cors(corsOptions)); // Cross-Origin Resource Sharing To connect to the server from a different origin
app.use(express.json()); // To parse JSON bodies
app.use(helmet()); // To set secure HTTP headers
app.use(morgan('combined')); // To log HTTP requests

app.get("/", (req, res, next) => {
    res.status(200).send("Welcome to Gamestorm");
    next();
});


app.post('/login', async (req, res) => {
    const { email, username } = req.body;
    console.log(`Login attempt for Email: ${email}, Username: ${username}`);

    if (!email || !username) {
        console.log('Missing email or username in request.');
        return res.status(400).json({ success: false, message: 'Email and Username are required.' });
    }

    try {
        const userQuery = 'SELECT * FROM player WHERE email = ? AND username = ?';
        const [users] = await db.promise().query(userQuery, [email, username]); // Destructure the result to get the first element of the array
        // console.log(`Number of users found: ${users.length}`);

        if (users.length === 0) {
            console.log('No matching user found.');
            return res.status(401).json({ success: false, message: 'Invalid email or username.' });
        }

        const user = users[0]; // Get the first user from the array
        // console.log(`User found: ${user.username}`);

        return res.status(200).json({ success: true, user: { id: user.id, email: user.email, username: user.username } });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
});

app.post('/register', (req, res) => {
    const { email, username, password } = req.body;
    const checkQuery = 'SELECT * FROM player WHERE username = ?';
    db.query(checkQuery, [username], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Server error.' });
        }
        if (results.length > 0) {
            return res.status(400).json({ message: 'Username already exists.' });
        }
        const insertQuery = 'INSERT INTO player (username, email) VALUES (?, ?)';
        db.query(insertQuery, [username, email], (err) => {
            if (err) {
                return res.status(500).json({ message: 'Server error.' });
            }
            res.json({ message: 'Account created successfully.' });
        });
    });
});


app.use("/player", playerRouter); 
app.use("/game", gameRouter); 
app.use("/reviews", reviewRouter);
app.use("/transaction", transactionRouter);

db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected to Database");
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Server listening on Port :", PORT);
})