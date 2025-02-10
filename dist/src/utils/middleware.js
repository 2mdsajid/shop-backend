import { getUserById } from '../user/user.services';
import jwt from 'jsonwebtoken';
export const checkUserExists = async (req, res, next) => {
    try {
        const bearer = req.headers.authorization;
        const token = bearer ? bearer.split(" ")[1] : null;
        if (!token) {
            return res.status(401).json({ message: "Unauthenticated" });
        }
        const secretkey = process.env.SECRET_KEY_FOR_AUTH;
        const userFromJWT = jwt.verify(token, secretkey);
        const user = (await getUserById(userFromJWT.id));
        if (!user) {
            return res.status(401).json({ message: "Unauthenticated" });
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
export const checkModerator = async (req, res, next) => {
    try {
        const bearer = req.headers.authorization;
        const token = bearer ? bearer.split(" ")[1] : null;
        if (!token) {
            return res.status(401).json({ message: "Unauthenticated" });
        }
        const secretkey = process.env.SECRET_KEY_FOR_AUTH;
        const userFromJWT = jwt.verify(token, secretkey);
        const user = (await getUserById(userFromJWT.id));
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (user.role === 'USER') {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
