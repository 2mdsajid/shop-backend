import { Request, Response, NextFunction } from 'express';
import prisma from "./prisma";
import { TBaseUser } from '../user/user.schema';
import { getUserById } from '../user/user.services';
import jwt from 'jsonwebtoken';


export interface RequestWithUser extends Request {
    user?: TBaseUser
}


export const checkUserExists = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const bearer = req.headers.authorization;
        const token = bearer ? bearer.split(" ")[1] : null;
        if (!token) {
            return res.status(401).json({ message: "Unauthenticated" });
        }
        const secretkey = process.env.SECRET_KEY_FOR_AUTH as string;
        const userFromJWT = jwt.verify(token, secretkey) as TBaseUser;
        const user = (await getUserById(userFromJWT.id)) as TBaseUser;
        if (!user) {
            return res.status(401).json({ message: "Unauthenticated" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};




export const checkModerator = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const bearer = req.headers.authorization;
        const token = bearer ? bearer.split(" ")[1] : null;
        if (!token) {
            return res.status(401).json({ message: "Unauthenticated" });
        }
        const secretkey = process.env.SECRET_KEY_FOR_AUTH as string;
        const userFromJWT = jwt.verify(token, secretkey) as TBaseUser;
        const user = (await getUserById(userFromJWT.id)) as TBaseUser;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (user.role === 'USER') {
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.user = user
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
