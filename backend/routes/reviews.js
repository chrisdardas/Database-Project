import { Router } from "express";
import { adminPool, developerPool, playerPool } from "../database.js";

const router = Router(); // Create a new router

router.get("/", async (req, res) => {
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
    db.query("SELECT rating, comment FROM review", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.status(200).send(result);
        }
    });
});

router.post("/", async (req, res) => {
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
    db.query("DELETE FROM review WHERE review_id = ?", [req.params.review_id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.status(200).send("Review Deleted");
        }
    });
});

export default router;