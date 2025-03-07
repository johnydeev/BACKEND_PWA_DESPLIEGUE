import ENVIROMENT from "../config/enviroment.config.js";
import UserRepository from "../repository/user.repository.js";
import { ServerError } from "../utils/error.utils.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import sendMail from "../config/nodemailer.config.js";

export const registerController = async (req , res) =>{
    console.log(req.body)
    try{
        const { username, password, email } = req.body;

        if (!username || !password || !email) {
            throw new ServerError("Campos no validos", 400);
        }

        const passwordHash = await bcrypt.hash(password, 10)
        
        const verification_token = jwt.sign(
            {email}, //Lo que se guarda en el token
            ENVIROMENT.SECRET_KEY_JWT, // Clave con la que se va a firmar
            {expiresIn: '24h'} // Tiempo de Expiracion del token
        )
        const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{3,}$/;
        if (!emailRegex.test(email)) {
            throw new ServerError("El email no tiene un formato válido", 400);
        }
        
        await UserRepository.create({
            username: username,
            password: passwordHash,
            email: email,
            verification_token,
        })       

        const mailResponse = await sendMail({
            to: email,
            subject: "Valida tu mail!",
            html: `
                <h1>Valida tu mail para entrar en nuestra pagina</h1>
                <p>
                Esta validacion es para asegurarnos que tu mail es realmente tuyo, si no te has registrado en (nombre de la empresa) entonces ignora este mail!
                </p>
                <a href='${ENVIROMENT.URL_BACKEND}/api/auth/verify-email?verification_token=${verification_token}'>
                    Verificar cuenta haciendo click aqui
                </a>
                `,
        })
        console.log("MailResponse>>", mailResponse) 
        
        return res.status(201).send({
            message: "Usuario registrado",
            status: 201,
            ok: true,
        });

    }catch(error){

        if(error.status){
            return res.status(400).send({
                ok: false,
                message: error.message,
                status: error.status,
            });
        }
        return res.status(500).send({
            ok: false,
            message: error.message,
            status: 500,
        });
    }    
}

export const verifyEmailController = async (req , res ) => {
    try{
        const {verification_token} = req.query
        const payload = jwt.verify(verification_token, ENVIROMENT.SECRET_KEY_JWT)        
        const { email } = payload
        const user_found = await UserRepository.verifyUserByEmail(email);
        console.log(user_found);
        res.redirect(ENVIROMENT.URL_FRONTEND +'/login')
        
    }catch(error){
        console.log('error al registrar', error)
        if(error.status){
            return res.send({
                ok: false,
                message: error.message,
                status: error.status,
            });
        }
        return res.send({
            ok: false,
            message: error.message,
            status: 500,
        });

    }
}

export const loginController = async (req , res) =>{
    try{
        const {email , password } = req.body
        console.log(email,password)
        const user_found = await UserRepository.findUserByEmail(email)
        if(!user_found){
            throw new ServerError("Usuario no encontrado", 404);
        }
        if (!user_found.verified) {
            throw new ServerError("El usuario no esta verificado", 400);
        }
        const isSamePassword = await bcrypt.compare(password, user_found.password)
        if(!isSamePassword){
            throw new ServerError("Contraseña incorrecta", 400);
        }
        const authorization_token = jwt.sign(
            {
                _id: user_found._id,
                username: user_found.username,
                email: user_found.email
            },
            ENVIROMENT.SECRET_KEY_JWT,
            {expiresIn: '24h'}
        )
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
        if (error.status) {
            return res.send({
                ok: false,
                message: error.message,
                status: error.status,
            });
        }
        return res.send({
            ok: false,
            message: error.message,
            status: 500,
        });

    }
}

export const resetPasswordController = async (req , res) => {
    try{
        const {email} = req.body
        const user_found = await UserRepository.findUserByEmail(email)

        if (!user_found) {
            throw new ServerError("Usuario no encontrado", 404);
        }
        if (!user_found.verified) {
            throw new ServerError("El usuario no esta verificado", 400);
        }
        const reset_token = jwt.sign({email, _id: user_found._id}, ENVIROMENT.SECRET_KEY_JWT, {expiresIn:'24h'})

        await sendMail({
            to: email, 
            subject:"Reset your Password",
            html:`
            <h1>Has solicitado resetear tu contraseña de no ser tu ignora este mail
            <a href='${ENVIROMENT.URL_FRONTEND}/rewrite-password?reset_token=${reset_token}'>Click aqui para resetear</a>`
            
        })

        res.status(201).send({
            ok: true,
            message: "Mail enviado",
            status: 201
        });
    
    }catch(error){
        console.log("error al resetear", error);
        if (error.status) {
            return res.send({
                ok: false,
                message: error.message,
                status: error.status,
            });
        }
        return res.send({
            ok: false,
            message: error.message,
            status: 500,
        });
    }
}

export const rewritePasswordController = async (req, res) =>{

    try{   
        
        const { password, confirmPassword , reset_token } = req.body;

        if (!reset_token) {
            throw new ServerError("El token es requerido", 400);
        }
        if (password !== confirmPassword) {
            throw new ServerError("Las contraseñas deben coincidir", 400);
        }

        const { _id } = jwt.verify(reset_token, ENVIROMENT.SECRET_KEY_JWT);

        if(!_id){
            throw new ServerError("El token no es valido o expiro")
        }
        
        const passwordHashed = await bcrypt.hash(password, 10);

        await UserRepository.updateUserPassword( _id , passwordHashed);
        console.log("Password:",password)
        console.log("ResetToken:", reset_token);
        res.status(200).send({
            ok: true,
            message: "Se ah modificado la contraseña con exito!",
            status: 200,
        });
    }catch(error){
        console.log("Error al confirmar pass", error);
        if (error.status) {
            return res.send({
                ok: false,
                message: error.message,
                status: error.status,
            });
        }
        return res.send({
            ok: false,
            message: error.message,
            status: 500,
        });
    }
}