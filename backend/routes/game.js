import { Router } from "express";
import { adminPool, playerPool, developerPool } from "../database.js";


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
    const { multiplayer_support } = req.query;
    // console.log(multiplayer_support);

    if (multiplayer_support !== undefined) {
        // console.log("Handling multiplayer_support filter");
        const sql = "SELECT game_id, title FROM game WHERE multiplayer_support = ?";
        db.query(sql, [multiplayer_support], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Database query failed");
            } else {
                res.status(200).send(result);
            }
        });
    } else {
        // console.log("Fetching all games");
        db.query("SELECT * FROM game", (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Database query failed");
            } else {
                res.status(200).send(result);
            }
        });
    }
});

router.get("/:game_id", async (req, res, next) => {
    // console.log("GETTING GAME BY ID");
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
    db.query("SELECT title FROM game WHERE game_id = ?", [req.params.game_id], (err, result) => {
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
        case "developer":
            db = developerPool;
            break;
        default:
            return res.status(403).send("Unauthorized");
    }
    db.query("INSERT INTO game (title, release_date, price, age_rating, dlcs_available, multiplayer_support, genre_name, developer_id, platform_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", 
        [req.body.title, req.body.release_date, req.body.price, req.body.age_rating, req.body.dlcs_available, 
            req.body.multiplayer_support, req.body.genre_name, req.body.developer_id, req.body.platform_id
        ], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.status(201).send("Game Added");
        }
    });
});

router.delete("/:game_id", async (req, res) => {
    const role = req.user.role;
    let db;
    switch(role){
        case "admin":
            db = adminPool;
            break;
        case "developer":
            db = developerPool;
            break;
        default:
            return res.status(403).send("Unauthorized");
    }
    db.query("DELETE FROM game WHERE game_id = ?", [req.params.game_id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.status(204).send("Game Deleted");
        }
    });
});


export default router; // Export the router