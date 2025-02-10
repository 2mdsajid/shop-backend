import express, { Request, Response } from 'express';
import { isUUID } from '../utils/functions';
import { checkUserExists, RequestWithUser } from '../utils/middleware';
import { createOrderSchema, orderStatusSchema, updateOrderStatusSchema } from './order.schema';
import * as OrderServices from './order.services'; // Import the product services
const router = express.Router();


// generate place-order-token and send to FE 
router.post('/create-order', checkUserExists, async (request: RequestWithUser, response: Response) => {
  try {
    const validationResult = createOrderSchema.safeParse(request.body);
    if (!validationResult.success) {
      const zodErrorElement = JSON.parse(validationResult.error.message)[0]
      return response.status(400).json({ data: null, message: zodErrorElement.message });
    }

    const userId = request.user?.id;
    if (!userId) {
      return response.status(400).json({ data: null, message: 'User not found' });
    }

    const orderToken = await OrderServices.createOrder(request.body, userId)
    if (!orderToken) {
      return response.status(400).json({ data: null, message: 'Token generation failed' });
    }
    return response.status(201).json({ data: orderToken, message: 'Order created' });
  } catch (error) {
    return response.status(500).json({ data: null, message: 'Internal Server Error' });
  }
})


// get place-order token items details from tokens from frontend 
router.get('/confirm-order-token-and-get-details/:token', checkUserExists, async (request: Request, response: Response) => {
  try {

    const orderToken = request.params.token;
    if (!orderToken) {
      return response.status(400).json({ data: null, message: 'No token provided' });
    }

    const orderId =await OrderServices.verifyOrderTokenAndGetOrderId(orderToken)
    if (!orderId) {
      return response.status(400).json({ data: null, message: 'Unable to verify order token' });
    }

    const orderDetails = await OrderServices.getOrderById(orderId)
    if (!orderDetails) {
      return response.status(400).json({ data: null, message: 'Unable to get order details' });
    }

    return response.status(201).json({ data: orderDetails, message: "Order details found" });
  } catch (error) {
    return response.status(500).json({ data: null, message: 'Internal Server Error' });
  }
})



// confirm the order items token and then store them and returns the product details
// get all order stats fro dashboard
router.get('/get-all-orders', async (request: Request, response: Response) => {
  try {
    const orders = await OrderServices.getAllOrders()
    if (!orders || orders.length === 0) {
      return response.status(400).json({ data: null, message: 'No orders found' });
    }
    return response.status(201).json({ data: orders });
  } catch (error) {
    return response.status(500).json({ data: null, message: 'Internal Server Error' });
  }
})

// get single order
router.get('/get-order-by-id/:orderId', async (request: Request, response: Response) => {
  try {
    const orderId = request.params.orderId
    if (!orderId || !isUUID(orderId)) {
      return response.status(401).json({ data: null, messsage: 'Missing Some Parameters!' })
    }
    const orderDetails = await OrderServices.getOrderById(orderId)
    if (!orderDetails) {
      return response.status(400).json({ data: null, message: 'Unable to get order details' });
    }
    return response.status(201).json({ data: orderDetails });
  } catch (error) {
    return response.status(500).json({ data: null, message: 'Internal Server Error' });
  }
})

// update the status of order
router.post('/update-order-status/:orderId', async (request: Request, response: Response) => {
  try {
    const orderId = request.params.orderId
    if (!orderId || !isUUID(orderId)) {
      return response.status(401).json({ data: null, messsage: 'Missing Some Parameters!' })
    }

    const validationResult = updateOrderStatusSchema.safeParse(request.body);
    if (!validationResult.success) {
      const zodErrorElement = JSON.parse(validationResult.error.message)[0]
      return response.status(400).json({ data: null, message: zodErrorElement.message });
    }

    const status = request.body.status
    if (!status || !orderStatusSchema.safeParse(status).success) {
      return response.status(400).json({ data: null, message: "Invalid status" });
    }

    const updatedOrder = await OrderServices.updateOrderStatus(status, orderId)
    if(!updatedOrder){
      return response.status(400).json({ data: null, message: "Failed to update order status" })
    }
    
    return response.status(200).json({ data: updatedOrder, message: "Order updated successfully" })

  } catch (error) {
    return response.status(500).json({ data: null, message: "Internal Server Error" })

  }
})


// get orders by a user
router.get('/get-orders-by-user-id/:userId', async (request: Request, response: Response) => {
  try {
    const userId = request.params.userId
    if (!userId || !isUUID(userId)) {
      return response.status(401).json({ data: null, messsage: 'Missing Some Parameters!' })
    }

    const orders = await OrderServices.getOrdersByUserId(userId)
    if (!orders || orders.length === 0) {
      return response.status(400).json({ data: null, message: 'No orders found' });
    }
    return response.status(200).json({ data: orders, message: "Orders fetched successfully" })
  } catch (error) {
    return response.status(500).json({ data: null, message: "Internal Server Error" })
  }
})

export default router;
