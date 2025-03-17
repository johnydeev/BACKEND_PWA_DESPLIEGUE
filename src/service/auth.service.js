import ENVIROMENT from "../config/enviroment.config.js";
import userRepository from "../repository/user.repository.js";
import { ServerError } from "../utils/error.utils.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthService {

    async login(email, password) {
        try {
            if (!email || !password) {
                throw new ServerError("Faltan credenciales", 400)
            }
            const user_found = await userRepository.findUserByEmail(email);
            if (!user_found) {
                throw new ServerError("Usuario no encontrado", 404);
            }
            if (!user_found.verified) {
                throw new ServerError("El usuario no esta verificado", 400);
            }
            const isSamePassword = await bcrypt.compare(
                password,
                user_found.password
            );
            if (!isSamePassword) {
                throw new ServerError("Contraseña incorrecta", 400);
            }
            const authorization_token = jwt.sign(
                {
                    _id: user_found._id,
                    username: user_found.username,
                    email: user_found.email,
                },
                ENVIROMENT.SECRET_KEY_JWT,
                { expiresIn: "24h" }
            );
            return { authorization_token };
        } catch (error) {
            throw new ServerError(error.message, error.status || 500);
        }
    }
}

const authService = new AuthService()
export default authService