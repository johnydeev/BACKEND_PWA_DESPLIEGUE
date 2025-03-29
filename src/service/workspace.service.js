import workspaceRepository from "../repository/workspace.repository.js";
import { ServerError } from "../utils/error.utils.js";


class WorkspaceService {
    async addMember({ workspace_id, member_id, owner_id }) {
        const workspace_found = await workspaceRepository.findWorkspaceById(
            workspace_id
        );

        if (!workspace_found) {
            throw new ServerError("Workspace No encontrado", 404);
        }
        if (workspace_found.owner !== owner_id) {
            throw new ServerError("No eres dueño de este Workspace", 403);
        }

        const is_member = await workspaceRepository.isUserMemberOfWorkspace({
            workspace_id,
            member_id,
        });

        if (is_member) {
            throw new ServerError("Ya eres miembro del workspace", 400);
        }
        await workspaceRepository.addMember(workspace_id, member_id);

        return workspace_found;
    }

    async createWorkspace({ name, owner_id }) {
        if (!name || !owner_id) {
            throw new ServerError("Faltan datos al crear workspace", 400);
        }
        const workspace_id = await workspaceRepository.createWorkspace({
            name,
            owner_id,
        });
        await workspaceRepository.addMember(workspace_id, owner_id);
        return { workspace_id, name, owner_id };
    }

    async getWorkspaces(user_id) {
        console.log("User_IDservice: ", user_id);
        return await workspaceRepository.getWorkspaces(user_id);
    }
}

const workspaceService = new WorkspaceService()
export default workspaceService