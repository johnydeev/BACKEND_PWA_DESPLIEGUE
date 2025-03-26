import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ServerError } from "../utils/error.utils.js";
import userRepository from "../repository/user.repository.js";
import sendMail from "../config/nodemailer.config.js";
import ENVIROMENT from "../config/enviroment.config.js";

class UserService {
    async createUser({ username, email, password }) {
        try {
            if (!username || !password || !email) {
                throw new ServerError("Campos no validos", 400);
            }

            const passwordHash = await bcrypt.hash(password, 10);

            const verification_token = jwt.sign(
                { email }, //Lo que se guarda en el token
                ENVIROMENT.SECRET_KEY_JWT, // Clave con la que se va a firmar
                { expiresIn: "24h" } // Tiempo de Expiracion del token
            )
            const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{3,}$/
            if (!emailRegex.test(email)) {
                throw new ServerError(
                    "El email no tiene un formato válido",
                    400
                );
            }

            const response = await userRepository.create({
                username: username,
                password: passwordHash,
                email: email,
                verification_token
                // profile_img 
            });

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
            });
            console.log("MailResponse>>", mailResponse);
            console.log("Respuesta: ", response);
            return response;
        } catch (error) {
            throw new ServerError(error.message, error.status || 500);
        }
    }

    async verifyUserByEmail(verification_token) {
        try {
            const payload = jwt.verify(
                verification_token,
                ENVIROMENT.SECRET_KEY_JWT
            );
            const { email } = payload;

            await userRepository.verifyUserByEmail(email, verification_token);

            const user_found = await userRepository.findUserByEmail(email);

            if (!user_found) {
                throw new ServerError("User not found", 404);
            }
            if (user_found.verified) {
                throw new ServerError("User has already been verified", 404);
            }
        } catch (error) {
            throw new ServerError(error.message, error.status || 500);
        }
    }

    async resetPassword({ email }) {
        try {
            const user_found = await userRepository.findUserByEmail(email);

            if (!user_found) {
                throw new ServerError("Usuario no encontrado", 404);
            }
            if (!user_found.verified) {
                throw new ServerError("El usuario no esta verificado", 400);
            }
            const reset_token = jwt.sign(
                { email, _id: user_found._id },
                ENVIROMENT.SECRET_KEY_JWT,
                { expiresIn: "24h" }
            );

            await sendMail({
                to: email,
                subject: "Reset your Password",
                html: `<p>Has solicitado resetear tu contraseña de no ser tu ignora este mail</p>
                        <a href='${ENVIROMENT.URL_FRONTEND}/rewrite-password?reset_token=${reset_token}'>Click aqui para resetear</a>`,
            })

        } catch (error) {
            throw new ServerError(error.message, error.status || 500);
        }
    }

    async updateUserPassword({ password, confirmPassword, reset_token }) {
        try {
            if (!reset_token) {
                throw new ServerError("El token es requerido", 400);
            }
            if (password !== confirmPassword) {
                throw new ServerError("Las contraseñas deben coincidir", 400);
            }

            const { _id } = jwt.verify(reset_token, ENVIROMENT.SECRET_KEY_JWT);

            if (!_id) {
                throw new ServerError("El token no es valido o expiro");
            }

            const passwordHashed = await bcrypt.hash(password, 10);

            await userRepository.updateUserPassword(_id, passwordHashed);

            // if (!user_found) {
            //     throw new ServerError("Usuario no encontrado", 404);
            // }

            console.log("Password:", password);
            console.log("ResetToken:", reset_token);
        } catch (error) {
            throw new ServerError(error.message, error.status || 500);
        }
    }
}

const userService = new UserService();

export default userService;
