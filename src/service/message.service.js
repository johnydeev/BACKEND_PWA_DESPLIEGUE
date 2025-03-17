import channelRepository from "../repository/channel.repository.js";
import messageRepository from "../repository/message.repository.js";
import { ServerError } from "../utils/error.utils.js";

class MessageService {
    async create({ channel_id, sender_id, content }) {
        if (!channel_id) {
            throw new ServerError("Faltan datos al crear mensaje", 400);
        }

        const channel_found = await channelRepository.findChannelById(
            channel_id
        );
        if (!channel_found) {
            throw new ServerError("Canal no encontrado", 404);
        }
        const response = await messageRepository.create({
            channel_id,
            sender_id,
            content,
        });
        return response;
    }

    async findMessagesByChannel({ channel_id }) {

        if (!channel_id) {
            throw new ServerError("Faltan datos al buscar mensajes", 400);
        }

        const channel_found = await channelRepository.findChannelById(channel_id);
        if (!channel_found) {
            throw new ServerError("Canal no encontrado", 404);
        }

        const response = await messageRepository.findMessagesByChannel({
            channel_id
        });
        return response;
    }
}

const messageService = new MessageService()
export default messageService