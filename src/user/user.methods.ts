import jwt from "jsonwebtoken";
import { TBaseUser } from "./user.schema";

export const generateAuthToken = async (userData: TBaseUser): Promise<string | null> => {
    try {
        const { id, email, name, role, googleId } = userData
        const token = jwt.sign({
            id: id,
            name: name,
            email: email,
            role: role,
            googleId: googleId
        }, process.env.SECRET_KEY_FOR_AUTH as string);
        return token
    } catch (error) {
        console.log("🚀 ~ generateAuthToken ~ error:", error)
        return null
    }
}