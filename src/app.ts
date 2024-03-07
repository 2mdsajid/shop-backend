import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import cartRouter from "./cart/cart.routes";
import router from "./product/product.routes";

dotenv.config();

if (!process.env.PORT) {
  console.log("Please specify port number ")
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10) || 3002

const app = express();

app.use(cors());
app.use(express.json());
app.use("/product", router);
app.use("/cart", cartRouter);
// app.use("/user", user);

app.get('/', async (req, res) => {
  try {
    return res.status(200).json({
      message: 'Hello, please do not cause unnecessary API calls',
    });

  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});