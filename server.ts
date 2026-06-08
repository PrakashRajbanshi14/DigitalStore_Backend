import app from "./src/app";
import { envConfig } from "./src/config/config";

function startServer() {
    const port = envConfig.port || 3000
    app.listen(port, () => {
        console.log(`Server is listening to the port ${port}`);
    })
}

startServer()