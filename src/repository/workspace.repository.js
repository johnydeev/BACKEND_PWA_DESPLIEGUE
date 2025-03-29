import promisePool from "../config/mysql.config.js";
import Workspace from "../models/Workspace.model.js";

class WorkspaceRepository {
    // async findWorkspaceById(id) {
    //     return await Workspace.findById(id);
    // }

    async findWorkspaceById(id) {
        const queryStr = `SELECT * FROM workspaces WHERE _id = ?`;

        const [result] = await promisePool.execute(queryStr, [id]);
        return result[0];
    }

    // async createWorkspace({ name, owner_id }) {
    //     const workspace = await Workspace.create({
    //         name,
    //         owner: owner_id,
    //         members: [owner_id],
    //     });
    //     return workspace;
    // }

    async createWorkspace({ name, owner_id }) {
        const queryStr = `
            INSERT INTO workspaces (name, owner) VALUES (?, ?)
        `;
        const [result] = await promisePool.execute(queryStr, [name, owner_id]);
        return result.insertId;
    }

    // async addMember({ workspace_id, owner_id, member_id }) {
    //     const workspace_found = await this.findWorkspaceById(workspace_id);
    //     //Si existe el workspace
    //     if (!workspace_found) {
    //         throw new ServerError("Workspace No encontrado", 404);
    //     }
    //     //si eres el dueño
    //     if (!workspace_found.owner.equals(owner_id)) {
    //         throw new ServerError("No eres dueño de este Workspace", 403);
    //     }
    //     // que el invitado no sea miembro del workspace
    //     if (workspace_found.members.includes(member_id)) {
    //         throw new ServerError("Ya eres miembro del workspace", 400);
    //     }

    //     workspace_found.members.push(member_id);
    //     await workspace_found.save();

    //     return workspace_found;
    // }

    async addMember(workspace_id, member_id) {
        const queryStr = `
            INSERT INTO workspace_members (workspace_id, user_id) VALUES (?, ?)
        `;
        await promisePool.execute(queryStr, [workspace_id, member_id]);
    }

    // async getWorkspaces() {
    //     return await Workspace.find();
    // }

    async getWorkspaces(id) {        
        const queryStr = `
            SELECT * FROM workspaces WHERE owner = ?
        `; 
        const [result] = await promisePool.execute(queryStr, [id]);
        console.log("Result: ", result);
        return result;
        
    }

    async isUserMemberOfWorkspace({ workspace_id, member_id }) {
        const queryStr = `
            SELECT * FROM workspace_members WHERE workspace_id = ? AND user_id = ?
        `;
        const [result] = await promisePool.execute(queryStr, [
            workspace_id,
            member_id,
        ]);

        return result.length > 0;
    }
}

const workspaceRepository = new WorkspaceRepository();
export default workspaceRepository;
