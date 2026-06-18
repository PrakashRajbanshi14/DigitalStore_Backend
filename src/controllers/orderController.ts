import { Request, Response } from "express";
import Order from "../database/models/orderModel";
import OrderDetails from "../database/models/orderDetails";
import { PaymentMethod } from "../globals/types";
import Payment from "../database/models/paymentModel";

interface Iproduct{
    productId : string,
    productQty : string
}

interface OrderRequest extends Request{
    user : {
        id : string
    }
}



class OrderController{
    async createOrder(req: OrderRequest, res : Response):Promise<void>{
        const userId = req.user.id;
        const {phoneNumber, shippingAddress, totalAmount, paymentMethod} = req.body;
        const products:Iproduct[] = req.body.products
        if(!phoneNumber || !shippingAddress || !totalAmount || products.length == 0){
            res.status(400).json({
                message : "Some fields are missing!"
            })
            return
        }
        //for orderModel
        const orderData = await Order.create({
            phoneNumber,
            shippingAddress,
            totalAmount,
            userId : userId
        })
        //for orderDetails
        products.forEach(async function(product){
            await OrderDetails.create({
                quantity : product.productQty,
                productId : product.productId,
                orderId : orderData.id
            })
        })
        //for paymentModel
        if(paymentMethod == PaymentMethod.COD){
            await Payment.create({
                orderId : orderData.id,
                paymentMethod: paymentMethod
            })
        }else if(paymentMethod == paymentMethod.khalti){


        }else{

        }
        res.status(200).json({
            message : "Order Created Successfully!"
        })
    }

}

export default new OrderController