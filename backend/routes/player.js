import  { Router } from "express";
import db from "../database.js";

const router = Router(); // Create a new router

router.get("/", async (req, res) => {
    const { ban_status, achievement_id } = req.query;

    const sql = "SELECT A.player_id, A.username, C.achievement_id, C.title, C.date_of_completion FROM player AS A JOIN player_unlocks_achievement AS B ON A.player_id = B.player_id JOIN achievement AS C ON B.achievement_id = C.achievement_id WHERE C.achievement_id = ?;";
    // console.log("ACHIEVEMENT ID: ", req.query);

    if (achievement_id !== undefined) {
        // console.log("ACHIEVEMENT ID: ", achievement_id);
        db.query(sql, [achievement_id], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.status(200).send(result);
            }
        });
    }
    else if (ban_status !== undefined) {
        db.query("SELECT player_id, username FROM player WHERE ban_status = ?", [ban_status], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.status(200).send(result);
            }
        });
    } else {
        db.query("SELECT * FROM player", (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.status(200).send(result);
            }
        });   
    }
});


router.get("/:player_id", async (req, res, next) => {
    db.query("SELECT * FROM player WHERE player_id = ?", [req.params.player_id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.status(200).send(result);
        }
    });
});

router.post("/login", async (req, res) => {
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

router.post("/", async (req, res) => {
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

router.put("/:player_id", async (req, res) => {
    db.query("UPDATE player SET username = ?, email = ?, total_playtime = ?, achievement_points = ?, ban_status = ?, last_login = ? WHERE player_id = ?", 
        [req.body.username, req.body.email, req.body.total_playtime, req.body.achievement_points, req.body.ban_status, req.body.last_login, req.params.player_id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.status(200).send("Player Updated");
        }
    });
});

router.delete("/:player_id", async (req, res) => {
    db.query("DELETE FROM player WHERE player_id = ?", [req.params.player_id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.status(204).send("Player Deleted");
        }
    });
});

export default router; // Export the router