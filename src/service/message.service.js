import channelRepository from "../repository/channel.repository.js";
import messageRepository from "../repository/message.repository.js";
import workspaceRepository from "../repository/workspace.repository.js";
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

    // async findMessagesByChannel({ channel_id }) {
    //     if (!channel_id) {
    //         throw new ServerError("Faltan datos al buscar mensajes", 400);
    //     }

    //     const channel_found = await channelRepository.findChannelById(
    //         channel_id
    //     );
    //     if (!channel_found) {
    //         throw new ServerError("Canal no encontrado", 404);
    //     }

    //     const response = await messageRepository.findMessagesByChannel({
    //         channel_id,
    //     });
    //     return response;
    // }

    async getMessagesFromChannel({ channel_id, user_id }) {

        console.log("Channel_ID: ", channel_id);
        console.log("User_ID: ", user_id);

        if (!channel_id || !user_id) {
            throw new ServerError("Faltan datos al buscar mensajes", 400);
        }
        const channel_found = await channelRepository.findChannelById(
            channel_id
        );
        if (!channel_found) {
            throw new ServerError("Canal no encontrado", 404);
        }
        const is_member = await workspaceRepository.isUserMemberOfWorkspace({
            member_id: user_id,
            workspace_id: channel_found.workspace,
        })
        if (!is_member) {
            throw new ServerError("No eres miembro del canal", 403);
        }

        console.log("Channel_ID2: ", channel_id);
        return await messageRepository.getMessagesFromChannel({channel_id});
    }
}

const messageService = new MessageService()
export default messageService