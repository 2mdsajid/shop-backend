import { PrismaClient } from '@prisma/client';
import { hashSync, genSaltSync } from 'bcrypt';

const prisma = new PrismaClient();

// Type for the User model
type User = {
    id: string;
    name: string;
    email: string;
};

// Type for the Product model
type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    userId: string;
};

// Type for the Comment model
type Comment = {
    id: number;
    content: string;
    productId: string;
    userId: string;
};

// Type for the Rating model
type Rating = {
    id: number;
    value: number;
    productId: string;
    userId: string;
};

// Type for the Review model
type Review = {
    id: number;
    title: string;
    content: string;
    productId: string;
    userId: string;
};

const createHashedPassword = (password: string): string => {
    const salt = genSaltSync(10);
    return hashSync(password, salt);
};

const createUser = async (name: string, email: string): Promise<User> => {
    return prisma.user.create({
        data: {
            name,
            email
        }
    })

    
};

const createProduct = async (name: string, description: string, price: number, imageUrl: string, userId: string): Promise<Product> => {
    return prisma.product.create({
        data: {
            name,
            description,
            price,
            imageUrl,
            userId,
        },
    });
};

const createComment = async (content: string, productId: string, userId: string): Promise<Comment> => {
    return prisma.comment.create({
        data: {
            content,
            productId,
            userId,
        },
    });
};

const createRating = async (value: number, productId: string, userId: string): Promise<Rating> => {
    return prisma.rating.create({
        data: {
            value,
            productId,
            userId,
        },
    });
};

const createReview = async (title: string, content: string, productId: string, userId: string): Promise<Review> => {
    return prisma.review.create({
        data: {
            title,
            content,
            productId,
            userId,
        },
    });
};

const seedDatabase = async () => {
    try {
        // Create users
        const user1 = await createUser("John Doe", "john@example.com");
        const user2 = await createUser("Alice Smith", "alice@example.com");

        // Create products
        const product1 = await createProduct("Handbag", "A stylish handbag", 49.99, "handbag.jpg", user1.id);
        const product2 = await createProduct("Backpack", "A durable backpack", 59.99, "backpack.jpg", user2.id);

        // Create comments, ratings, and reviews
        await createComment("Great product!", product1.id, user2.id);
        await createRating(4, product1.id, user1.id);
        await createReview("Awesome handbag!", "I love this handbag. It's stylish and spacious.", product1.id, user2.id);

        await createComment("Nice backpack!", product2.id, user1.id);
        await createRating(5, product2.id, user2.id);
        await createReview("Excellent backpack!", "Durable and comfortable to carry.", product2.id, user1.id);

        console.log("Database seeded successfully!");
    } catch (error) {
        console.error("Error seeding the database:", error);
    } finally {
        await prisma.$disconnect();
    }
};

seedDatabase();
