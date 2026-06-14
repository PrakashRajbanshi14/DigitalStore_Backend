import { Request, Response } from "express";
import Product from "../database/models/productModel";
import Category from "../database/models/categoryModel";

interface  ProductRequest extends Request {
    file? : {
        filename : string
    }
}

class productController {
    async createProduct(req: ProductRequest, res: Response):Promise<void>{
        const {productName, productDescription, productPrice, productTotalStock, discount, categoryId} = req.body;
        const filename = req.file ? req.file.filename : "https://unsplash.com/s/photos/product";
        if(!productName || !productDescription || !productPrice || !productTotalStock || !categoryId){
            res.status(400).json({
                message : "Some Fields are MIssing!"
            })
            return
        }
        await Product.create({
            productName,
            productDescription,
            productPrice,
            productTotalStock,
            discount : discount || 0,
            categoryId,
            productImageUrl : filename
        })
        res.status(200).json({
            message : "Product Added Successfully!"
        })
    }

    async getAllProducts(req : Request, res : Response):Promise<void>{
        const datas = await Product.findAll({
            include : [
                {
                    model : Category
                }
            ]
        })
        res.status(200).json({
            message : "Products fetched successfully!",
            data : datas
        })
    }
     
    async getSingleProduct(req : Request, res: Response):Promise<void>{
        const {id} = req.params;
        const datas = await Product.findAll({
            where : {
                id : id
            },
            include : [
                {
                    model : Category
                }
            ]
        })
        res.status(200).json({
            message : "Product Fetched Successfully!",
            data : datas
        })
    }

    async deleteProduct(req : Request, res: Response):Promise<void>{
        const {id} = req.params;
        const datas = await Product.findAll({
            where : {
                id : id
            }
        })
        if(datas.length === 0){
            res.status(404).json({
                message : "No product with that id"
            })
        } else{
            await Product.destroy({
                where : {
                    id : id
                }
            })
        }
        res.status(200).json({
            message : "Product deleted Successfully!",
            data : datas
        })
    }
}

export default new productController