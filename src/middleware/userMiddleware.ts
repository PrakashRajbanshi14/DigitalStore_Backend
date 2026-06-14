import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { envConfig } from "../config/config";
import User from "../database/models/userModel";

export enum Role{
    Admin ='admin',
    Customer = 'customer'
}

interface IExtendedRequest extends Request{
    user? : {
        id: string,
        username : string,
        email: string,
        password: string,
        role : string
    }
}

class UserMiddleware {
    async isUserLoggedIn(req: IExtendedRequest, res:Response, next:NextFunction):Promise<void>{
        // receive token
        const token = req.headers.authorization
        if(!token){
            res.status(403).json({
                message : "Token must be provided!"
            })
            return
        }

        //validate token
        jwt.verify(token, envConfig.jwtSecretKey as string, async(err, result:any)=>{
            if(err){
                res.status(403).json({
                    message: "Invalid token"
                })
            }else{
                const userData = await User.findByPk(result.userId)
                if(!userData){
                    res.status(404).json({
                        message : "No user with that useerId"
                    })
                    return
                }
                req.user = userData
                next()
            }
        })
    }

    async restrictTo(...roles:Role[]){
        return  (req: IExtendedRequest, res: Response, next:NextFunction)=>{
            let userRole = req.user?.role as Role
            console.log("Role" + userRole);
        }
    }

}

export default new UserMiddleware