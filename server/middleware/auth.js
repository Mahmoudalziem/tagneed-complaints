import jwt from "jsonwebtoken";

export default function auth(roles = []) {
    if (typeof roles === "string") {
        roles = [roles];
    }
    return [
        (req, res, next) => {
            const token = req.header("x-auth-token");
            if (!token) res.status(401).send("Access denied! No token provided");
            try {
                // const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
                const decoded = jwt.decode(token);
                req.user = decoded;
                if (roles.length && !roles.includes(req.user.role)) {
                    // user's role is not authorized
                    return res.status(401).json({ message: "Unauthorized!" });
                }
                next();
            } catch (err) {
                res.status(403).send("Invalid token!");
            }
        },
    ];
}