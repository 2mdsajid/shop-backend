import jwt from "jsonwebtoken";
export const generateAuthToken = async (userData) => {
    try {
        const { id, email, name, role, googleId } = userData;
        const token = jwt.sign({
            id: id,
            name: name,
            email: email,
            role: role,
            googleId: googleId
        }, process.env.SECRET_KEY_FOR_AUTH);
        return token;
    }
    catch (error) {
        console.log("🚀 ~ generateAuthToken ~ error:", error);
        return null;
    }
};
