"use strict";
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
exports.getUserById = exports.changeRole = exports.signupWithLuciaGoogleUser = exports.loginWithLuciaGoogleUser = exports.loginUser = exports.userSignUp = exports.isUserExist = exports.checkEmailExist = void 0;
const functions_1 = require("../utils/functions");
const prisma_1 = __importDefault(require("../utils/prisma"));
const user_methods_1 = require("./user.methods");
const checkEmailExist = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserWithEmailExist = yield prisma_1.default.user.findFirst({
        where: { email }
    });
    if (isUserWithEmailExist)
        return true;
    return false;
});
exports.checkEmailExist = checkEmailExist;
const isUserExist = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isIdUuid = (0, functions_1.isUUID)(id);
    if (!isIdUuid)
        return false;
    const user = yield prisma_1.default.user.findUnique({
        where: { id }
    });
    if (!user)
        return false;
    return true;
});
exports.isUserExist = isUserExist;
const userSignUp = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = userData;
    const newUser = yield prisma_1.default.user.create({
        data: {
            name,
            email,
            password,
        }
    });
    return newUser;
});
exports.userSignUp = userSignUp;
const loginUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, email } = userData;
        const existingUser = yield prisma_1.default.user.findFirst({
            where: {
                email, password
            }
        });
        if (!existingUser)
            return null;
        const token = yield (0, user_methods_1.generateAuthToken)(existingUser);
        return token;
    }
    catch (error) {
        return null;
    }
});
exports.loginUser = loginUser;
const loginWithLuciaGoogleUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, googleId } = userData;
        const existingUser = yield prisma_1.default.user.findFirst({
            where: {
                email,
                googleId
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                googleId: true
            }
        });
        if (!existingUser)
            return null;
        return existingUser;
    }
    catch (error) {
        return null;
    }
});
exports.loginWithLuciaGoogleUser = loginWithLuciaGoogleUser;
const signupWithLuciaGoogleUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, googleId, name, image } = userData;
        const existingUser = yield prisma_1.default.user.create({
            data: {
                email,
                googleId,
                name,
                image
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                googleId: true
            }
        });
        if (!existingUser)
            return null;
        return existingUser;
    }
    catch (error) {
        console.log("🚀 ~ signupWithLuciaGoogleUser ~ error:", error);
        return null;
    }
});
exports.signupWithLuciaGoogleUser = signupWithLuciaGoogleUser;
const changeRole = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, email } = userData;
        const existingUser = yield prisma_1.default.user.findFirst({
            where: {
                email, password
            }
        });
        if (!existingUser)
            return null;
        const changesUser = yield prisma_1.default.user.update({
            where: {
                id: existingUser.id
            },
            data: {
                role: "SAJID",
            }
        });
        if (!changesUser)
            return null;
        return changesUser.id;
    }
    catch (error) {
        return null;
    }
});
exports.changeRole = changeRole;
const getUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: {
            id: userId
        },
        select: {
            id: true,
            name: true,
            email: true,
            googleId: true,
            role: true,
        }
    });
    if (!user)
        return null;
    return user;
});
exports.getUserById = getUserById;
