const categories = [
    {
        name: 'sling_bags',
        description: 'A wide range of electronic devices and gadgets.',
        imageUrl: "https://picsum.photos/200"
    },
    {
        name: 'office_bags',
        description: 'Fashionable apparel for men, women, and kids.',
        imageUrl: "https://picsum.photos/200"
    },
    {
        name: 'school_bags',
        description: 'Everything you need for your home and kitchen.',
        imageUrl: "https://picsum.photos/200"
    },
    {
        name: 'handbags',
        description: 'Explore a vast collection of books across genres.',
        imageUrl: "https://picsum.photos/200"
    },
    {
        name: 'travel_bags',
        description: 'Gear and equipment for sports and outdoor activities.',
        imageUrl: "https://picsum.photos/200"
    },
];
const products = [
    {
        name: "Classic Leather Sling Bag",
        description: "High-quality leather sling bag with adjustable strap.",
        price: 199.99,
        imageUrl: "https://picsum.photos/200",
        category: "sling_bags",
        isFreeDelivery: true,
        availableStock: 50,
        brand: "LeatherPro",
        images: ["https://picsum.photos/200", "https://picsum.photos/200"],
        isNew: true
    },
    {
        name: "Professional Office Briefcase",
        description: "Elegant office briefcase with laptop compartment.",
        price: 799.99,
        imageUrl: "https://picsum.photos/200",
        category: "office_bags",
        isFreeDelivery: true,
        availableStock: 30,
        brand: "BusinessElite",
        images: ["https://picsum.photos/200", "https://picsum.photos/200"],
        isNew: true
    },
    {
        name: "Waterproof School Backpack",
        description: "Durable school backpack with multiple compartments.",
        price: 249.99,
        imageUrl: "https://picsum.photos/200",
        category: "school_bags",
        isFreeDelivery: false,
        availableStock: 20,
        brand: "SchoolComfort",
        images: ["https://picsum.photos/200", "https://picsum.photos/200"],
        isNew: true
    },
    {
        name: "Designer Handbag",
        description: "Stylish designer handbag with premium finish.",
        price: 49.99,
        imageUrl: "https://picsum.photos/200",
        category: "handbags",
        isFreeDelivery: true,
        availableStock: 100,
        brand: "FashionStyle",
        images: ["https://picsum.photos/200", "https://picsum.photos/200"],
        isNew: true
    }
];
const announcement = {
    content: "Valentine Sling BOGO SALE only at ₹1599",
    isActive: true
};
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function generateAnnouncement() {
    await prisma.announcement.create({
        data: announcement
    });
    console.log('Announcement seeded successfully!');
}
async function main() {
    // // Seed categories
    // for (const category of categories) {
    //   await prisma.category.create({
    //     data: category,
    //   });
    // }
    // console.log('Categories seeded successfully!');
    // // Fetch all categories from the database
    // const allCategories = await prisma.category.findMany();
    // Seed products and randomly assign categories
    for (const product of products) {
        await prisma.product.create({
            data: {
                ...product,
            },
        });
    }
    console.log('Products seeded successfully with random categories!');
}
generateAnnouncement();
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
