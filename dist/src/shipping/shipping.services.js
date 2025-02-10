import prisma from "../utils/prisma";
export const createShippingAddress = async (shippingAddress, userId) => {
    const { fullName, phoneNumber, address, city, state, pincode } = shippingAddress;
    const newShippingAddress = await prisma.shippingAddress.create({
        data: {
            fullName,
            phoneNumber,
            address,
            city,
            state,
            pincode,
            userId
        }
    });
    if (!newShippingAddress)
        return null;
    return newShippingAddress;
};
export const getShippingAddress = async (userId) => {
    const shippingAddress = await prisma.shippingAddress.findMany({
        where: { userId },
        select: {
            id: true,
            fullName: true,
            phoneNumber: true,
            address: true,
            city: true,
            state: true,
            pincode: true,
        }
    });
    if (!shippingAddress)
        return [];
    return shippingAddress;
};
