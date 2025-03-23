import promisePool from "../config/mysql.config.js";
import User from "../models/User.model.js";
import { ServerError } from "../utils/error.utils.js";

class UserRepository {
    // async create({ username, password, email, verification_token }) {

    //     await User.create({ username, password, email, verification_token });
    // }

    async create({
        username,
        email,
        password,
        verification_token,
        profile_img,
    }) {
        try {
            let queryStr = `
                INSERT INTO users (username, email, password, verification_token, profile_img)
                VALUES (?, ?, ?, ?,?)
            `;
            const [result] = await promisePool.execute(queryStr, [
                username,
                email,
                password,
                verification_token,
                profile_img,
            ]);
            const userId = result.insertId;
            const user = await this.findUserById(userId);
            return user;
        } catch (error) {
            throw new ServerError(error.message, error.status || 500);
        }
    }

    async findUserById(id) {
        const queryStr = `SELECT * FROM users WHERE _id = ?`;

        const [result] = await promisePool.execute(queryStr, [id]);
        return result[0];
    }

    // async verifyUserByEmail(email) {
    //     const user_found = await User.findOne({ email: email });
    //     if (!user_found) {
    //         throw new ServerError("User not found", 404);
    //     }
    //     if (user_found.verified) {
    //         throw new ServerError("User has already been verified", 404);
    //     }
    //     user_found.verified = true;
    //     await user_found.save();
    //     return user_found;
    // }

    // async findUserByEmail(email) {
    //     return await User.findOne({ email: email });
    // }

    async verifyUserByEmail(email, verification_token) {
        const queryStr = `UPDATE users SET verified = 1 WHERE email = ? AND verification_token = ?`;

        const [result] = await promisePool.execute(queryStr, [
            email,
            verification_token,
        ]);

        return result[0];
    }

    async findUserByEmail(email) {
        const queryStr = `SELECT * FROM users WHERE email = ?`;

        const [result] = await promisePool.execute(queryStr, [email]);
        console.log("Result: ", result);
        return result[0];
    }

    // async updateUserPassword(id, password) {
    //     const user_found = await User.findById(id);
    //     if (!user_found) {
    //         throw new ServerError("Usuario no encontrado", 404);
    //     }
    //     user_found.password = password;
    //     await user_found.save();
    // }

    async updateUserPassword(id, password) {
        const queryStr = `UPDATE users SET password = ? WHERE _id = ?`;

        const result = await promisePool.execute(queryStr, [password, id]);

        return result[0];
    }
}

const userRepository = new UserRepository();
export default userRepository;
