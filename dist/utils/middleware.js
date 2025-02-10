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
exports.checkModerator = exports.checkUserExists = void 0;
const user_services_1 = require("../user/user.services");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const checkUserExists = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bearer = req.headers.authorization;
        const token = bearer ? bearer.split(" ")[1] : null;
        if (!token) {
            return res.status(401).json({ message: "Unauthenticated" });
        }
        const secretkey = process.env.SECRET_KEY_FOR_AUTH;
        const userFromJWT = jsonwebtoken_1.default.verify(token, secretkey);
        const user = (yield (0, user_services_1.getUserById)(userFromJWT.id));
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
});
exports.checkUserExists = checkUserExists;
const checkModerator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bearer = req.headers.authorization;
        const token = bearer ? bearer.split(" ")[1] : null;
        if (!token) {
            return res.status(401).json({ message: "Unauthenticated" });
        }
        const secretkey = process.env.SECRET_KEY_FOR_AUTH;
        const userFromJWT = jsonwebtoken_1.default.verify(token, secretkey);
        const user = (yield (0, user_services_1.getUserById)(userFromJWT.id));
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
});
exports.checkModerator = checkModerator;
