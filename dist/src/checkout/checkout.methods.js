import { randomBytes } from "crypto";
export function generateSecureToken(chars = 32) {
    return randomBytes(chars).toString("hex"); // 64-char secure token
}
