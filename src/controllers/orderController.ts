import { Request, Response } from "express";
import Order from "../database/models/orderModel";
import OrderDetails from "../database/models/orderDetails";
import { PaymentMethod } from "../globals/types";
import Payment from "../database/models/paymentModel";
import axios from "axios"

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
        const paymentData = await Payment.create({
                orderId : orderData.id,
                paymentMethod: paymentMethod
        })
        if(paymentMethod == paymentMethod.khalti){
            // khalti logic for test integration
            const data = {
                return_url : "http://localhost:5173/",
                website_URL : "http://localhost:5173/",
                amount : totalAmount *100, // in paisa
                purchase_order_id : orderData.id,
                purchase_order_name : "order_" + orderData.id
            }
            const response = await axios.post("https://dev.khalti.com/api/v2/epayment/initiate/", data, {
                headers : {
                    Authorization : "key 69e6251ff9df4c14bba4a50e70df4640"
                }
            })
            const khaltiResponse = response.data;
            paymentData.pidx = khaltiResponse.pidx
            paymentData.save()
            res.status(200).json({
                message : "Order Created Successfully!",
                url : khaltiResponse.payment_url
            })
        }else{

        }
    }

}

export default new OrderController