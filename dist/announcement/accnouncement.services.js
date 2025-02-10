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
exports.getAnnouncement = exports.createAnnouncement = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const createAnnouncement = (announcement) => __awaiter(void 0, void 0, void 0, function* () {
    const { content, isActive } = announcement;
    const newAnnouncement = yield prisma_1.default.announcement.create({
        data: { content, isActive: isActive || false }
    });
    if (!newAnnouncement)
        return null;
    return newAnnouncement;
});
exports.createAnnouncement = createAnnouncement;
const getAnnouncement = () => __awaiter(void 0, void 0, void 0, function* () {
    const announcement = yield prisma_1.default.announcement.findFirst({
        where: {
            isActive: true
        }
    });
    if (!announcement)
        return null;
    return announcement;
});
exports.getAnnouncement = getAnnouncement;
