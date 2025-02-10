"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../utils/middleware");
const UserMethods = __importStar(require("./user.methods"));
const user_schema_1 = require("./user.schema");
const UserServices = __importStar(require("./user.services"));
const router = express_1.default.Router();
router.get('/get-user-session', middleware_1.checkUserExists, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = request.user;
        return response.status(200).json({ data: user, message: 'Sesssion Found!' });
    }
    catch (error) {
        return response.status(500).json({ data: null, message: 'Internal Server Error' });
    }
}));
router.post('/signup', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validationResult = user_schema_1.createUserSchema.safeParse(request.body);
        if (!validationResult.success) {
            const zodErrorElement = JSON.parse(validationResult.error.message)[0];
            return response.status(400).json({ data: null, message: zodErrorElement.message });
        }
        const validatedData = validationResult.data;
        const existingUserWithEmail = yield UserServices.checkEmailExist(validatedData.email);
        if (existingUserWithEmail) {
            return response.status(400).json({ data: null, message: 'An User with email already exist' });
        }
        const user = yield UserServices.userSignUp(validatedData);
        if (!user) {
            return response.status(400).json({ data: null, message: 'User not created' });
        }
        // login user after creating the account
        const loginToken = yield UserServices.loginUser({
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
}));
router.post('/login', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validationResult = user_schema_1.loginUserSchema.safeParse(request.body);
        if (!validationResult.success) {
            const zodErrorElement = JSON.parse(validationResult.error.message)[0];
            return response.status(400).json({ data: null, message: zodErrorElement.message });
        }
        const validatedData = validationResult.data;
        const existingUserWithEmail = yield UserServices.checkEmailExist(validatedData.email);
        if (!existingUserWithEmail) {
            return response.status(400).json({ data: null, message: 'Incorrect credentials' });
        }
        const userLoginToken = yield UserServices.loginUser(validatedData);
        if (!userLoginToken) {
            return response.status(404).json({ data: null, message: 'Incorrect credentials' });
        }
        // this token will be ustored in cookie and will be sent back to bacnend server with every requests
        return response.status(200).json({ data: userLoginToken, message: 'Logged in successfully!' });
    }
    catch (error) {
        return response.status(500).json({ data: null, message: 'Internal Server Error' });
    }
}));
router.post('/lucia-google-auth', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate request body
        const validationResult = user_schema_1.loginWithLuciaGoogleSchema.safeParse(request.body);
        if (!validationResult.success) {
            const zodErrorElement = JSON.parse(validationResult.error.message)[0];
            return response.status(400).json({ data: null, message: zodErrorElement.message });
        }
        const validatedData = validationResult.data;
        const { googleId, email, name, image } = validatedData;
        // Check if the email exists in the database
        const existingUserWithEmail = yield UserServices.checkEmailExist(email);
        if (existingUserWithEmail) {
            const user = yield UserServices.loginWithLuciaGoogleUser(validatedData);
            //    check if user is null
            if (!user) {
                return response.status(404).json({ data: null, message: 'Incorrect credentials' });
            }
            return response.status(200).json({ data: user, message: 'Logged in successfully!' });
        }
        // If user doesn't exist, create a new user account
        const newUser = yield UserServices.signupWithLuciaGoogleUser({
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
}));
router.post('/generate-auth-token', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validationResult = user_schema_1.generateAuthTokenSchema.safeParse(request.body);
        if (!validationResult.success) {
            const zodErrorElement = JSON.parse(validationResult.error.message)[0];
            return response.status(400).json({ data: null, message: zodErrorElement.message });
        }
        const validatedData = validationResult.data;
        const existingUserWithEmail = yield UserServices.checkEmailExist(validatedData.email);
        if (!existingUserWithEmail) {
            return response.status(404).json({ data: null, message: 'Incorrect credentials' });
        }
        const authToken = yield UserMethods.generateAuthToken(validatedData);
        if (!authToken) {
            return response.status(404).json({ data: null, message: 'Incorrect credentials' });
        }
        return response.status(200).json({ data: authToken, message: 'Logged in successfully!' });
    }
    catch (error) {
        return response.status(500).json({ data: null, message: 'Internal Server Error' });
    }
}));
exports.default = router;
