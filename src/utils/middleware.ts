import { Request, Response, NextFunction } from 'express';
import prisma from "./prisma";

export interface RequestWithUserId extends Request {
    userId?: string;
  }

export const checkUserExists = async (req: RequestWithUserId, res: Response, next: NextFunction): Promise<any> => {
    const userId = req.body.userId as string;

    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        console.log("🚀 ~ checkUserExists ~ existingUser:", existingUser)

        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.userId = userId;  // Assigning userId to req.userId
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
