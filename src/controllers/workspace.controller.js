import workspaceService from "../service/workspace.service.js"
import { handleError } from "../utils/error.utils.js"

export const createWorkspaceController = async (req , res) => {

    try{
        const { name } = req.body
        const owner_id = req.user._id
        const new_workspace = await workspaceService.createWorkspace({name , owner_id})
        console.log(name)
        return res.json(
            {
                ok: true,
                status: 201,
                message: "Workspace Creado!",
                data: {
                    new_workspace
                },
            }
        )

    }catch(error){
        console.log('error al crear el Workspace')
        handleError(res, error)
    }    
}

export const inviteUserToWorkspace = async (req, res) => {
    try {
        const user_id = req.user._id;
        const { invited_id, workspace_id } = req.params;

        const workspace_found = await workspaceService.addMember({owner_id: user_id, workspace_id , member_id: invited_id})

        res.json(
            {
                ok:true,
                status: 201,
                message: "Usuario Agregado!",
                data:{
                    workspace_found
                }
            }
        )

    } catch (error) {
        console.log("Error al invitar al workspace", error);
        handleError(res, error);
    }
};

export const getWorkspacesController = async (req, res) => {
    try {
        const workspaces_found = await workspaceService.getWorkspaces();

        return res.json({
            ok: true,
            status: 200,
            message: "Lista de Workspaces",
            data: {
                workspaces_found,
            },
        });
    } catch (error) {
        console.log("Error al obtener los workspaces");
        handleError(res, error);
    }
};