import User from "../models/User.model.js"
import { ServerError } from "../utils/error.utils.js";

class UserRepository {
    async create({username, password, email,verification_token}){
        await User.create({ username, password, email, verification_token });
    }
    
    async verifyUserByEmail(email){
        const user_found = await User.findOne({ email: email });
        if (!user_found) {
            throw new ServerError("User not found", 404);
        }
        if (user_found.verified) {
            throw new ServerError("User has already been verified", 404);
        }
        user_found.verified = true;
        await user_found.save();
        return user_found;
    }
    async findUserByEmail(email){
        return await User.findOne({email: email})
    }

    async updateUserPassword(id, password){
        const user_found = await User.findById(id)
        if(!user_found){
            throw new ServerError("Usuario no encontrado", 404);
        }
        user_found.password = password
        await user_found.save()
    }
}

export default new UserRepository()