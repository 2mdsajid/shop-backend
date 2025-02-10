import express from 'express';
import { checkUserExists } from '../utils/middleware';
import * as UserMethods from './user.methods';
import { createUserSchema, generateAuthTokenSchema, loginUserSchema, loginWithLuciaGoogleSchema } from './user.schema';
import * as UserServices from './user.services';
const router = express.Router();
router.get('/get-user-session', checkUserExists, async (request, response) => {
    try {
        const user = request.user;
        return response.status(200).json({ data: user, message: 'Sesssion Found!' });
    }
    catch (error) {
        return response.status(500).json({ data: null, message: 'Internal Server Error' });
    }
});
router.post('/signup', async (request, response) => {
    try {
        const validationResult = createUserSchema.safeParse(request.body);
        if (!validationResult.success) {
            const zodErrorElement = JSON.parse(validationResult.error.message)[0];
            return response.status(400).json({ data: null, message: zodErrorElement.message });
        }
        const validatedData = validationResult.data;
        const existingUserWithEmail = await UserServices.checkEmailExist(validatedData.email);
        if (existingUserWithEmail) {
            return response.status(400).json({ data: null, message: 'An User with email already exist' });
        }
        const user = await UserServices.userSignUp(validatedData);
        if (!user) {
            return response.status(400).json({ data: null, message: 'User not created' });
        }
        // login user after creating the account
        const loginToken = await UserServices.loginUser({
            email: user.email,
            password: user.password
        });
        if (!loginToken) {
            return response.status(400).json({ data: null, message: 'User not logged in' });
        }
        return response.status(200).json({ data: loginToken, message: 'User Created' });
    }
    catch (error) {
        // if (error instanceof z.ZodError) {
        //     return response.status(400).json({ message: error.errors[0].message });
        // }
        return response.status(500).json({ data: null, message: 'Internal Server Error' });
    }
});
router.post('/login', async (request, response) => {
    try {
        const validationResult = loginUserSchema.safeParse(request.body);
        if (!validationResult.success) {
            const zodErrorElement = JSON.parse(validationResult.error.message)[0];
            return response.status(400).json({ data: null, message: zodErrorElement.message });
        }
        const validatedData = validationResult.data;
        const existingUserWithEmail = await UserServices.checkEmailExist(validatedData.email);
        if (!existingUserWithEmail) {
            return response.status(400).json({ data: null, message: 'Incorrect credentials' });
        }
        const userLoginToken = await UserServices.loginUser(validatedData);
        if (!userLoginToken) {
            return response.status(404).json({ data: null, message: 'Incorrect credentials' });
        }
        // this token will be ustored in cookie and will be sent back to bacnend server with every requests
        return response.status(200).json({ data: userLoginToken, message: 'Logged in successfully!' });
    }
    catch (error) {
        return response.status(500).json({ data: null, message: 'Internal Server Error' });
    }
});
router.post('/lucia-google-auth', async (request, response) => {
    try {
        // Validate request body
        const validationResult = loginWithLuciaGoogleSchema.safeParse(request.body);
        if (!validationResult.success) {
            const zodErrorElement = JSON.parse(validationResult.error.message)[0];
            return response.status(400).json({ data: null, message: zodErrorElement.message });
        }
        const validatedData = validationResult.data;
        const { googleId, email, name, image } = validatedData;
        // Check if the email exists in the database
        const existingUserWithEmail = await UserServices.checkEmailExist(email);
        if (existingUserWithEmail) {
            const user = await UserServices.loginWithLuciaGoogleUser(validatedData);
            //    check if user is null
            if (!user) {
                return response.status(404).json({ data: null, message: 'Incorrect credentials' });
            }
            return response.status(200).json({ data: user, message: 'Logged in successfully!' });
        }
        // If user doesn't exist, create a new user account
        const newUser = await UserServices.signupWithLuciaGoogleUser({
            email,
            googleId,
            name,
            image,
        });
        if (!newUser) {
            return response.status(404).json({ data: null, message: 'Incorrect credentials' });
        }
        // Send the user in response
        return response.status(200).json({ data: newUser, message: 'Logged in successfully!' });
    }
    catch (error) {
        console.error("Error during Google login:", error);
        return response.status(500).json({ data: null, message: 'Internal Server Error' });
    }
});
router.post('/generate-auth-token', async (request, response) => {
    try {
        const validationResult = generateAuthTokenSchema.safeParse(request.body);
        if (!validationResult.success) {
            const zodErrorElement = JSON.parse(validationResult.error.message)[0];
            return response.status(400).json({ data: null, message: zodErrorElement.message });
        }
        const validatedData = validationResult.data;
        const existingUserWithEmail = await UserServices.checkEmailExist(validatedData.email);
        if (!existingUserWithEmail) {
            return response.status(404).json({ data: null, message: 'Incorrect credentials' });
        }
        const authToken = await UserMethods.generateAuthToken(validatedData);
        if (!authToken) {
            return response.status(404).json({ data: null, message: 'Incorrect credentials' });
        }
        return response.status(200).json({ data: authToken, message: 'Logged in successfully!' });
    }
    catch (error) {
        return response.status(500).json({ data: null, message: 'Internal Server Error' });
    }
});
export default router;
