import promisePool from "../config/mysql.config.js";
import Message from "../models/Message.model.js";
import { ServerError } from "../utils/error.utils.js";
import channelRepository from "./channel.repository.js";

class MessageRepository {
    // async create({ sender_id, channel_id, content }) {
    //     const channel_found = await channelRepository.findChannelById(
    //         channel_id
    //     );
    //     console.log("Channel encontrado: ", channel_found);
    //     if (!channel_found) {
    //         throw new ServerError("Canal no encontrado", 404);
    //     }

    //     if (!channel_found.workspace.members.includes(sender_id)) {
    //         throw new ServerError("No eres miembro del workspace", 404);
    //     }
    //     const new_message = await Message.create({
    //         sender: sender_id,
    //         channel: channel_id,
    //         content,
    //     });
    //     return new_message;
    // }

    async create({ sender_id, channel_id, content }) {
        const queryStr = `INSERT INTO messages (sender, channel, content) VALUES (?, ?, ?)`;
        const [result] = await promisePool.execute(queryStr, [
            sender_id,
            channel_id,
            content,
        ]);

        return { id: result.insertId, sender_id, channel_id, content };
    }

    // async findMessagesByChannel({ channel_id, user_id }) {
    //     const channel_found = await channelRepository.findChannelById(
    //         channel_id
    //     );

    //     console.log("Canal encontrado: ", channel_found);
    //     if (!channel_found) {
    //         throw new ServerError("Canal no encontrado", 404);
    //     }
    //     if (!channel_found.workspace.members.includes(user_id)) {
    //         throw new ServerError("No eres miembro", 404);
    //     }
    //     try {
    //         const messages_list = await Message.find({
    //             channel: channel_id,
    //         }).populate("sender", "username email");
    //         console.log(messages_list);
    //         return messages_list;
    //     } catch (error) {
    //         console.log("Error en repo");
    //     }
    // }

    async findMessagesFromChannel({ channel_id }) {
        const queryStr = `SELECT * FROM messages WHERE channel = ?`;
        const [result] = await promisePool.execute(queryStr, [channel_id]);
        console.log("Result: ", result);
        return result;
    }

    async getMessagesByUser({ channel_id }) {
        const queryStr = `
        SELECT 
                messages._id, 
                messages.content, 
                messages.created_at, 
                users.username,
                users.profile_img
        FROM messages
        JOIN users
        ON messages.sender = users._id
        WHERE messages.channel = ?
        ORDER BY messages.created_at ASC
        `;
        const [messages] = await promisePool.execute(queryStr, [channel_id]);
        console.log("Messages: ", messages);
        return { messages };
    }

    
}

const messageRepository = new MessageRepository()

export default messageRepository

