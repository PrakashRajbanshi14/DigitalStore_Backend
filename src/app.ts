import express, { Request, Response } from 'express'
const app = express()
import userRoute from './routes/userRoute'
import categoryRoute from './routes/categoryRoute'
import productRoute from './routes/productRoute'
import orderRoute from "./routes/orderRoute"
import "./database/connection"

app.use(express.json())

app.use("/api/auth", userRoute)
app.use('/api/category', categoryRoute)
app.use('/api/product', productRoute)
app.use('/api/order', orderRoute)

export default app

