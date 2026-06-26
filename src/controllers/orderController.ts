import { Request, Response } from "express";
import Order from "../database/models/orderModel";
import OrderDetails from "../database/models/orderDetails";
import { PaymentMethod, PaymentStatus } from "../globals/types";
import Payment from "../database/models/paymentModel";
import axios from "axios"
import Cart from "../database/models/cartModel";

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
        const {phoneNumber, firstName, lastName, email, state, city, zipCode, addressLine, totalAmount, paymentMethod} = req.body;
        const products:Iproduct[] = req.body.products
        if(!firstName || !lastName || !email || !state || !zipCode || !city ||  !phoneNumber || !addressLine || !totalAmount || products.length == 0){
            res.status(400).json({
                message : "Some fields are missing!"
            })
            return
        }
        //for orderModel
        const orderData = await Order.create({
            phoneNumber,
            addressLine,
            totalAmount,
            userId : userId,
            firstName,
            lastName,
            email,
            city,
            state,
            zipCode
        })
        //for orderDetails
         let data;
        products.forEach(async function(product){
             data = await OrderDetails.create({
                quantity : product.productQty,
                productId : product.productId,
                orderId : orderData.id
            })

            await Cart.destroy({
                where: {
                    productId: product.productId,
                    userId : userId
                }
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
                url : khaltiResponse.payment_url,
                pidx: khaltiResponse.pidx,
                data
            })
        }else if(paymentMethod == PaymentMethod.Esewa){
            // ESEWA logic

        }else{
            res.status(200).json({
                message : "Order created successfully",
                data
            })
        }
    }

    async verifyTransaction(req : OrderRequest, res : Response):Promise<void>{
        const {pidx} = req.body
         if(!pidx){
        res.status(400).json({
          message : "Please provide pidx"
        })
        return
      }
      const response = await axios.post("https://a.khalti.com/api/v2/epayment/lookup/",{
        pidx : pidx
      },{
        headers : {
          "Authorization" : "key 69e6251ff9df4c14bba4a50e70df4640"
        }
      })
      const data = response.data 
      if(data.status === "Completed"){
        await Payment.update({paymentStatus : PaymentStatus.Paid},{
          where : {
            pidx : pidx 
          }
        })
        res.status(200).json({
          message : "Payment verified successfully !!"
        })
      }else{
        res.status(200).json({
          message : "Payment not verified or cancelled"
        })
      }
    }
}

export default new OrderController