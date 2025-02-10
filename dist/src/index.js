import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import cartRouter from "./cart/cart.routes";
import productRouter from "./product/product.routes";
import userRouter from "./user/user.routes";
import checkoutRouter from "./checkout/checkout.routes";
import orderRouter from "./order/order.routes";
import announcementRouter from "./announcement/announcement.routes";
import shippingRouter from "./shipping/shipping.routes";
dotenv.config();
if (!process.env.PORT) {
    console.log("Please specify port number ");
    process.exit(1);
}
const PORT = parseInt(process.env.PORT, 10) || 3002;
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Adjust the limit as needed
app.use(express.urlencoded({ limit: '10mb', extended: true }));
// Add your routes here
app.use("/announcement", announcementRouter);
app.use("/cart", cartRouter);
app.use("/checkout", checkoutRouter);
app.use("/order", orderRouter);
app.use("/product", productRouter);
app.use("/shipping", shippingRouter);
app.use("/user", userRouter);
app.get('/', async (req, res) => {
    try {
        return res.status(200).json({
            message: 'Hello, please do not cause unnecessary API calls',
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
app.listen(PORT, () => {
    console.log(`Listening http://localhost:${PORT}/`);
});
