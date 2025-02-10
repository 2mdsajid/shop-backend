import prisma from "../utils/prisma";
import { TAnnouncement, TCreateAnnouncement } from "./announcement.schema";

export const createAnnouncement = async (announcement: TCreateAnnouncement): Promise<TAnnouncement | null> => {
    const { content, isActive } = announcement;
    const newAnnouncement = await prisma.announcement.create({
        data: { content, isActive: isActive || false }
    });
    if (!newAnnouncement) return null;
    return newAnnouncement;
}

export const getAnnouncement = async (): Promise<TAnnouncement | null> => {
    const announcement = await prisma.announcement.findFirst({
        where: {
            isActive: true
        }
    });
    if (!announcement) return null;
    return announcement;
}


