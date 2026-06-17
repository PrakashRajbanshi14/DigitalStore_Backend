import { Sequelize } from "sequelize-typescript";
import { envConfig } from "../config/config";
import Product from "./models/productModel";
import Category from "./models/categoryModel";
import Order from "./models/orderModel";
import User from "./models/userModel";
import Payment from "./models/paymentModel";
import OrderDetails from "./models/orderDetails";

const sequelize = new Sequelize(envConfig.connectionString as string, {
    models: [__dirname + '/models']
})
try {
    sequelize.authenticate()
        .then(() => {
            console.log("Database Connected Successfully!");
        })
        .catch((err: any) => {
            console.log("Error" + err);
        })
} catch (error) {
    console.log(error);
}

sequelize.sync({ force: false, alter: false })  // alter : true helps to keep the data and update the column 
    .then(() => {
        console.log("Database Synced Successfully!");
})

// relationships
// CategoryId on ProductTable
Product.belongsTo(Category,{foreignKey: "categoryId"})  // in product table categoryid as a foreign key will be stored
Category.hasOne(Product,{foreignKey: "categoryId"})

// UserId on Ordertable
User.hasMany(Order, {foreignKey: "userId"})
Order.belongsTo(User,{foreignKey: "userId"})

//  orderId on PaymentTable
Payment.belongsTo(Order, {foreignKey: "orderId"})
Order.hasOne(Payment, {foreignKey: "orderId"})

// productId on OrderDetailsTable
OrderDetails.belongsTo(Product,{foreignKey: "productid"})
Product.hasMany(OrderDetails, {foreignKey: "productId"})

// orderId on OrderDetails Table
OrderDetails.belongsTo(Order, {foreignKey: "orderId"})
Order.hasOne(OrderDetails, {foreignKey: "orderId"})

export default sequelize;