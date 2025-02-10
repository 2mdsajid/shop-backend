"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSecureToken = generateSecureToken;
const crypto_1 = require("crypto");
function generateSecureToken(chars = 32) {
    return (0, crypto_1.randomBytes)(chars).toString("hex"); // 64-char secure token
}
