import prisma from '../utils/prisma';
import { generateSecureToken } from './checkout.methods';
import { TCheckoutItemInput, TCheckoutItemWithProductBase } from './checkout.schema';



// generate checkout token for checkout pages
export const generateCheckoutToken = async (items: TCheckoutItemInput[]): Promise<string | null> => {
    try {   
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15); // Expires in 15 minutes

        const checkoutToken = await prisma.checkoutToken.create({
            data: {
                token:generateSecureToken(),
                expiresAt: expiresAt,
                CheckoutTokenItems: {
                    create: items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                    })),
                },
            },
        });
        return checkoutToken.token;
    } catch (error) {
        console.log("🚀 ~ generateCheckoutToken ~ error:", error);
        return null;
    }
};

// decode token for checkout
export const decodeCheckoutToken = async (token: string): Promise<TCheckoutItemWithProductBase[] | null> => {
    try {

        const checkoutToken = await prisma.checkoutToken.findUnique({
            where: {
                token: token
            },
            include: {
                CheckoutTokenItems: {
                    select: {
                        id: true,
                        productId: true,
                        quantity: true,
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                imageUrl: true,
                                category: true,
                                isFreeDelivery: true,
                                brand: true,
                                isNew: true,
                                discount: {
                                    select: {
                                        isActive: true,
                                        value: true,
                                    }
                                },
                            }
                        }
                    }
                }
            }
        });

        if (!checkoutToken) {
            return null;
        }

        return checkoutToken.CheckoutTokenItems.map((item) => ({
            id: item.id,
            productId: item.productId,
            quantity: item.quantity,
            checkoutId: checkoutToken.id,
            product: item.product
        }));

    } catch (error) {
        console.log("🚀 ~ decodeCheckoutToken ~ error:", error)
        return null
    }
};