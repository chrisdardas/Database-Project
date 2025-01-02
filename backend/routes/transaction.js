import { Router } from 'express';
import { adminPool, playerPool, developerPool } from "../database.js"; // Import the database connection

const router = Router(); // Router for transaction

router.post("/:player_id", async (req, res) => {
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
    db.query("INSERT INTO transaction (transaction_amount, payment_method, player_id) VALUES (?, ?, ?)", 
        [req.body.transaction_amount, req.body.payment_method, req.params.player_id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.status(201).send("Transaction Added");
        }
    });
});

export default router; // Export the router