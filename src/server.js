import ENVIROMENT from "./config/enviroment.config.js";
import express from 'express'
import authRouter from "./routes/auth.route.js"
import connectToMongoDB from "./config/mongoDB.config.js";
import cors from 'cors'
import { AuthMiddleware } from "./middlewares/authMiddleware.js";
import workspaceRouter from "./routes/workspace.route.js";
import channelRouter from "./routes/channel.router.js";

const app = express()

connectToMongoDB()
// app.use(cors())
app.use(cors(
    {
        origin: ENVIROMENT.URL_FRONTEND
    }
))
app.use(express.json())
app.use('/api/auth', authRouter)
app.use('/api/workspaces', workspaceRouter)
app.use('/api/channels', channelRouter)
app.get('/api/test/comprar', AuthMiddleware, (req, res) =>{
    console.log(req.user)
    res.json({
        message: "Producto comprado"
    })
})

app.listen(ENVIROMENT.PORT, () => {
    console.log(`el servidor esta ejecutandose en el puerto http://localhost:${ENVIROMENT.PORT}`)
})
