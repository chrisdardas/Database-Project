import  { Router } from "express";
import jwt from "jsonwebtoken";
import { adminPool, playerPool, developerPool } from "../database.js";
import authenticate from "../authentication.js";

const router = Router(); // Create a new router

router.post("/login", async (req, res) => {
    const db = playerPool;
    const { email, username } = req.body;
        console.log(`Login attempt for Email: ${email}, Username: ${username}`);
    
        if (!email || !username) {
            console.log('Missing email or username in request.');
            return res.status(400).json({ success: false, message: 'Email and Username are required.' });
        }
    
        try {
            const userQuery = 'SELECT * FROM player WHERE email = ? AND username = ?';
            const [users] = await db.query(userQuery, [email, username]); // Destructure the result to get the first element of the array
            // console.log(`Number of users found: ${users.length}`);
    
            if (users.length === 0) {
                console.log('No matching user found.');
                return res.status(401).json({ success: false, message: 'Invalid email or username.' });
            }
    
            const user = users[0]; // Get the first user from the array
            // console.log(`User found: ${user.username}`);

            const token = jwt.sign(
                { id: user.player_id, role: 'player' },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
    
            return res.status(200).json({ success: true, token, user: { id: user.id, email: user.email, username: user.username } });
        } catch (error) {
            console.error('Error during login:', error);
            return res.status(500).json({ success: false, message: 'Server error.' });
        }
});


router.post("/", async (req, res) => {
    const { username, email, password, role } = req.body; 
    console.log(`Registration attempt for Username: ${username}, Email: ${email}, Role: ${role}`);
    const db = playerPool;
    // let db;
    // switch(role){
    //     case "admin":
    //         db = adminPool;
    //         break;
    //     case "developer":
    //         db = developerPool;
    //         break;
    //     case "player":
    //         db = playerPool;
    //         break;
    //     default:
    //         return res.status(400).json({ message: "Invalid role specified." });
    // }

    const checkQuery = "SELECT * FROM player WHERE username = ?";
    const insertQuery = "INSERT INTO player (username, email) VALUES (?, ?)";

    try {
        // Check if username already exists
        const [existingUsers] = await db.query(checkQuery, [username]);

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Username already exists.' });
        }
        // Insert the new player
        const token = jwt.sign(
            { username, email, role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        await db.query(insertQuery, [username, email]); 
        res.status(201).json({ message: 'Account created successfully.', token });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

router.use(authenticate); // Apply the authenticate middleware to all the routes in this router

router.get("/", async (req, res) => {
    const { ban_status, achievement_id } = req.query;
    const role = req.user.role;
    console.log("ROLE: ", req);
    const sql = "SELECT A.player_id, A.username, C.achievement_id, C.title, C.date_of_completion FROM player AS A JOIN player_unlocks_achievement AS B ON A.player_id = B.player_id JOIN achievement AS C ON B.achievement_id = C.achievement_id WHERE C.achievement_id = ?;";
    // console.log("ACHIEVEMENT ID: ", req.query);
    let db;
    switch(role){
        case "admin":
            db = adminPool;
            break;
        case "player":
            db = playerPool;
            break;
        case "developer":
            db = developerPool;
            break;
        default:
            return res.status(403).send("Unauthorized");
    }
    try{
        if (achievement_id !== undefined) {
            // console.log("ACHIEVEMENT ID: ", achievement_id);
            const [results] = await db.query(sql, [achievement_id]);
            res.status(200).send(results);
        }
        else if (ban_status !== undefined) {
            const [results] = await db.query("SELECT player_id, username FROM player WHERE ban_status = ?", [ban_status]);
            res.status(200).send(results);
        } else {
            const [results] = await db.query("SELECT * FROM player");   
            res.status(200).send(results);
        }
    } catch (error) {
        console.error('Error fetching players:', error);
        res.status(500).json({ message: 'Server error.' });
    };

});


router.get("/:player_id", async (req, res, next) => {
    const role = req.user.role;
    let db;
    switch(role){
        case "admin":
            db = adminPool;
            break;
        case "player":
            db = playerPool;
            break;
        case "developer":
            db = developerPool;
            break;
        default:
            return res.status(403).send("Unauthorized");
    }
    try {
        const [results] = await db.query("SELECT * FROM player WHERE player_id = ?", [req.params.player_id]);
        res.status(200).send(results);
    } catch (error) {
        console.error('Error fetching player:', error);
        res.status(500).json({ message: 'Server error.' });
    };
});


router.put("/:player_id", async (req, res) => {
    const role = req.user.role;
    let db;
    switch(role){
        case "admin":
            db = adminPool;
            break;
        case "player":
            db = playerPool;
            break;
        case "developer":
            db = developerPool;
            break;
        default:
            return res.status(403).send("Unauthorized");
    }
    const sql = "UPDATE player SET username = ?, email = ?, total_playtime = ?, achievement_points = ?, ban_status = ?, last_login = ? WHERE player_id = ?";
    const values =[
        req.body.username,
        req.body.email,
        req.body.total_playtime,
        req.body.achievement_points,
        req.body.ban_status,
        req.body.last_login,
        req.params.player_id
    ];
    try{
        const [ results ] = await db.query(sql, values);
        res.status(201).send("Player Updated");
    } catch (error) {
        console.error('Error updating player:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

router.delete("/:player_id", async (req, res) => {
    const role = req.user.role;
    let db;
    if(role === "admin"){
        db = adminPool;
    } else {
        return res.status(403).send("Unauthorized");
    }
    try {
        const [results] = await db.query('DELETE FROM player WHERE player_id = ?', [req.params.player_id]);
        res.status(204).send("Player Deleted");
    } catch (error) {
        console.error('Error deleting player:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

export default router; // Export the router