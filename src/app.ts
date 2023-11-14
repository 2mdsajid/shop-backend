import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import router from "./product/product.routes";
import cartRouter from "./cart/cart.routes";

// import { authorRouter } from "./author/author.router";
// import { bookRouter } from "./book/book.router";

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(cors());
app.use(express.json());
app.use("/product", router);
app.use("/cart", cartRouter);

app.get('/',(req,res)=>{
res.status(200).json({
    message:'Helllo pleasee do not cause unnecessary api calls'
})    
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});