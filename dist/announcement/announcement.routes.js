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
const announcement_schema_1 = require("./announcement.schema");
const AnnouncementServices = __importStar(require("./accnouncement.services"));
const router = express_1.default.Router();
// mkae a route to get make announcement
router.post('/make-announcement', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validationResult = announcement_schema_1.createAnnouncementSchema.safeParse(req.body);
        if (!validationResult.success) {
            const zodErrorElement = JSON.parse(validationResult.error.message)[0];
            return res.status(400).json({ data: null, message: zodErrorElement.message });
        }
        const validatedData = validationResult.data;
        const newAnnouncement = yield AnnouncementServices.createAnnouncement(validatedData);
        if (!newAnnouncement) {
            return res.status(400).json({ data: null, message: "Announcement not created" });
        }
        return res.status(201).json({ message: "announcement created", newAnnouncement });
    }
    catch (error) {
        console.log("🚀 ~ router.post ~ error:", error);
        return res.status(500).json({ message: error.message });
    }
}));
// get all announcements
router.get('/get-announcement', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const announcement = yield AnnouncementServices.getAnnouncement();
        if (!announcement) {
            return res.status(404).json({ data: null, message: "No announcements found" });
        }
        return res.status(200).json({ data: announcement, message: "Announcement fetched successfully" });
    }
    catch (error) {
        console.log("🚀 ~ router.get/get-announcements ~ error:", error);
        return res.status(500).json({ data: null, message: error.message });
    }
}));
exports.default = router;
