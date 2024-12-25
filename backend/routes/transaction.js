import { Router } from 'express';
import db from '../database.js';

const router = Router(); // Router for transaction

router.post("/:player_id", async (req, res) => {
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