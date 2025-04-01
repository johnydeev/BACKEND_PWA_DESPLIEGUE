import channelRepository from "../repository/channel.repository.js";
import workspaceRepository from "../repository/workspace.repository.js";
import { ServerError } from "../utils/error.utils.js";

class ChannelService {
    async createChannel({ name, workspace_id, member_id }) {
        if (!name || !workspace_id || !member_id) {
            throw new ServerError("Faltan datos al crear canal", 400);
        }

        const workspace_found = await workspaceRepository.findWorkspaceById(
            workspace_id
        );
        if (!workspace_found) {
            throw new ServerError("Workspace no encontrado", 404);
        }
        if (
            !workspaceRepository.isUserMemberOfWorkspace({
                workspace_id,
                member_id,
            })
        ) {
            throw new ServerError("El usuario no pertenece al Workspace", 403);
        }
        const new_channel = await channelRepository.createChannel({
            name,
            workspace_id,
        });

        return new_channel;
    }

    async getChannelListByWorkspace({ workspace_id }) {

        if(!workspace_id){
            throw new ServerError("No existe workspace id")
        }
        const channel_list = await channelRepository.getChannelListByWorkspace({workspace_id})

        if(!channel_list){
            throw new ServerError("Lista no encontrada",404)
        }

        return channel_list
    }

    async findChannelById(channel_id) {
        if (!channel_id) {
            throw new ServerError("Faltan datos al buscar canal", 400);
        }
        const channel_found = await channelRepository.findChannelById(
            channel_id
        );
        if (!channel_found) {
            throw new ServerError("Canal no encontrado", 404);
        }
        return channel_found;
    }
}

const channelService = new ChannelService();
export default channelService;
