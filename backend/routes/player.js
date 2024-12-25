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

router.post("/", async (req, res) => {
    db.query("INSERT INTO player (username, email) VALUES (?, ?)", 
        [req.body.username, req.body.email, req.body.total_playtime, req.body.achievement_points, req.body.ban_status, req.body.last_login], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.status(201).send("Player Added");
        }
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