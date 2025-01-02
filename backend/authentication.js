import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if( !authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).send("Unauthorized");
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(err) {
        console.log(err);
        return res.status(403).json({message: "Invalid"});
    }
};

export default authenticate;