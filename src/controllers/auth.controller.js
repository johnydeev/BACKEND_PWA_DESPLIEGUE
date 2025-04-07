import ENVIROMENT from "../config/enviroment.config.js";
import { handleError } from "../utils/error.utils.js"
import userService from "../service/user.service.js";
import authService from "../service/auth.service.js";

export const registerController = async (req , res) =>{
    console.log(req.body)
    try{
        const { username, password, email } = req.body; 
        
        await userService.createUser({
            username,
            password,
            email,            
        });        
        

        return res.status(201).send({
            ok: true,
            message: "Usuario registrado",
            status: 201,
        });

    }catch(error){
        handleError(res, error);
    }    
}

export const loginController = async (req , res) =>{
    try{
        const {email , password } = req.body
        console.log(email,password)
        
        const authorization_token = await authService.login(email, password);
        console.log(authorization_token)
        
        return res.json(
            {
                ok:true,
                status: 200, 
                message:"Logueo exitoso",
                payload:{
                    authorization_token
                }
            }
        )

    }catch(error){
        console.log("error al loguear", error);
        handleError(res, error);
    }
}

export const resetPasswordController = async (req, res) => {
    try {
        const { email } = req.body;

        console.log("Email reset: ", email);

        await userService.resetPassword({ email });

        res.status(201).send({
            ok: true,
            message: "Mail enviado",
            status: 201,
        });
    } catch (error) {
        console.log("error al resetear password", error);
        handleError(res, error);
    }
};

export const verifyEmailController = async (req, res) => {
    try {
        const { verification_token } = req.query;

        const user_found = await userService.verifyUserByEmail(
            verification_token
        );
        console.log(user_found);

        res.redirect(ENVIROMENT.URL_FRONTEND + "/login");
    } catch (error) {
        console.log("error al registrar", error);
        handleError(res, error);
    }
};


export const rewritePasswordController = async (req, res) =>{

    try{   
        
        const { password, confirmPassword , reset_token } = req.body;        

        await userService.updateUserPassword({password, confirmPassword, reset_token})

        res.status(200).send({
            ok: true,
            message: "Se ah modificado la contraseña con exito!",
            status: 200,
        });
    }catch(error){
        console.log("Error al cambiar password", error);
        handleError(res, error);
    }
}