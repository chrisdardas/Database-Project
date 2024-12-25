import { Router } from "express";
import db from "../database.js";

const router = Router(); // Create a new router

router.get("/", async (req, res) => {
    db.query("SELECT rating, comment FROM review", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.status(200).send(result);
        }
    });
});

router.post("/", async (req, res) => {
    db.query("INSERT INTO review (review_id, rating, comment, publication_date, player_id) VALUES (?, ?, ?, ?, ?)", 
        [req.body.rating, req.body.comment], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.status(201).send("Review Added");
        }
    });
});

router.put("/:review_id", async (req, res) => {
    db.query("UPDATE review SET rating = ?, comment = ? WHERE review_id = ?", 
        [req.body.rating, req.body.comment, req.params.review_id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.status(200).send("Review Updated");
        }
    });
});

router.delete("/:review_id", async (req, res) => {
    db.query("DELETE FROM review WHERE review_id = ?", [req.params.review_id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.status(200).send("Review Deleted");
        }
    });
});

export default router;