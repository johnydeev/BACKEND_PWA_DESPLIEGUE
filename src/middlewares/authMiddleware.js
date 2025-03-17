
import ENVIROMENT from "../config/enviroment.config.js";
import { handleError, ServerError } from "../utils/error.utils.js";
import jwt from "jsonwebtoken";

export const AuthMiddleware = (req, res, next) => {
    try{
        const authorization_header = req.headers['authorization']
        if(!authorization_header){
            throw new ServerError("no has proporcionado un header de autorizacion",401)
        }

        const autorization_token = authorization_header.split(" ")[1]
        if(!autorization_token){
            throw new ServerError("No has proporcionado un token de autorizacion",401)
        }

        const user_info = jwt.verify(autorization_token, ENVIROMENT.SECRET_KEY_JWT)

        req.user = user_info

        next()
        
    }catch(error){
        console.log("Error al autenticar", error);
        handleError(res, error);
    }
}

