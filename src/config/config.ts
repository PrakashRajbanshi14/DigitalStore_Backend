import { config } from "dotenv"
config()

export const envConfig = {
    connectionString: process.env.DB_URI,
    port: process.env.PORT,
    jwtSecretKey: process.env.JWT_SECRET_KEY,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,
    companyEmail: process.env.COMPANY_EMAIL,
    companyEmailPass : process.env.COMPANY_EMAIL_PASS
}
