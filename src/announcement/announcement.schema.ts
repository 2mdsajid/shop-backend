import { z } from "zod";

export const announcementSchema = z.object({
    id: z.number({
        required_error: "ID is required",
    }),
    content: z.string({
        required_error: "Content is required",
    }),
    isActive: z.boolean().optional(),
    createdAt: z.date({
        required_error: "Created at is required",
    }),
});


export const createAnnouncementSchema = z.object({
    content: z.string({
        required_error: "Content is required",
    }),
    isActive: z.boolean().optional(),
});


export type TCreateAnnouncement = z.infer<typeof createAnnouncementSchema>;
export type TAnnouncement = z.infer<typeof announcementSchema>;