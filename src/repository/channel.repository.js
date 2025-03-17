import promisePool from "../config/mysql.config.js";
import Channel from "../models/Channel.model.js";
import { ServerError } from "../utils/error.utils.js";
import workspaceRepository from "./workspace.repository.js";

class ChannelRepository {
    // async findChannelById(channel_id) {
    //     return Channel.findById(channel_id).populate("workspace");
    // }


    async findChannelById(channel_id) {
        const queryStr = `SELECT * FROM channels WHERE _id = ?`;
        const [result] = await promisePool.execute(queryStr, [channel_id]);
        return result[0];
    }

    // async createChannel(name, workspace_id, user_id) {
    //     const workspace_found = await workspaceRepository.findWorkspaceById(
    //         workspace_id
    //     );

    //     if (!workspace_found) {
    //         throw new ServerError("Workspace no encontrado", 404);
    //     }
    //     if (!workspace_found.members.includes(user_id)) {
    //         throw new ServerError("El usuario no pertenece al Workspace", 403);
    //     }
    //     const channel = await Channel.create({
    //         channel: name,
    //         workspace: workspace_id,
    //         create_by: user_id,
    //     });
    //     return channel;
    // }

    async createChannel({name, workspace_id}) {
        
        const queryStr = `INSERT INTO channels (name, workspace) VALUES (?, ?)`;
        const [result] = await promisePool.execute(queryStr, [name, workspace_id]);
        const channel_id = result.insertId;
        return {channel_id, name, workspace_id};
    }
}

const channelRepository = new ChannelRepository()
export default channelRepository