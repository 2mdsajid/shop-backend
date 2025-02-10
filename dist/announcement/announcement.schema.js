"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAnnouncementSchema = exports.announcementSchema = void 0;
const zod_1 = require("zod");
exports.announcementSchema = zod_1.z.object({
    id: zod_1.z.number({
        required_error: "ID is required",
    }),
    content: zod_1.z.string({
        required_error: "Content is required",
    }),
    isActive: zod_1.z.boolean().optional(),
    createdAt: zod_1.z.date({
        required_error: "Created at is required",
    }),
});
exports.createAnnouncementSchema = zod_1.z.object({
    content: zod_1.z.string({
        required_error: "Content is required",
    }),
    isActive: zod_1.z.boolean().optional(),
});
