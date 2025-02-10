import prisma from "../utils/prisma";
export const createAnnouncement = async (announcement) => {
    const { content, isActive } = announcement;
    const newAnnouncement = await prisma.announcement.create({
        data: { content, isActive: isActive || false }
    });
    if (!newAnnouncement)
        return null;
    return newAnnouncement;
};
export const getAnnouncement = async () => {
    const announcement = await prisma.announcement.findFirst({
        where: {
            isActive: true
        }
    });
    if (!announcement)
        return null;
    return announcement;
};
