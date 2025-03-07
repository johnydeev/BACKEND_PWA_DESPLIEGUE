import workspaceRepository from "../repository/workspace.repository.js"

export const createWorkspaceController = async (req , res) => {

    try{
        const { name } = req.body
        const owner_id = req.user._id
        const new_workspace = await workspaceRepository.createWorkspace({name , owner_id})
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

        if(error.status){
            return res.status(400).send({
                ok: false,
                message: error.message,
                status: error.status,
            });
        }
        return res.status(500).send({
            ok: false,
            message: error.message,
            status: 500,
        });
    }    
}

export const inviteUserToWorkspace = async (req, res) => {
    try {
        const user_id = req.user._id;
        const { invited_id, workspace_id } = req.params;

        const workspace_found = await workspaceRepository.addNewMember({owner_id: user_id, workspace_id , invited_id})

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
        console.log("Error al autenticar", error);
        if (error.status) {
        return res.send({
            ok: false,
            message: error.message,
            status: error.status,
        });
        }
        return res.send({
        ok: false,
        message: error.message,
        status: 500,
        });
    }
};

export const getWorkspaces = async () =>{
    try{

        workspaces_found = await workspaceRepository.getWorkspaces()

        return res.json({
            ok: true,
            status: 200,
            message: "Lista de Workspaces",
            data: {
                workspaces_found,
            },
        });
    

    } catch (error) {
        console.log("Error al autenticar", error);
        if (error.status) {
        return res.send({
            ok: false,
            message: error.message,
            status: error.status,
        });
        }
        return res.send({
        ok: false,
        message: error.message,
        status: 500,
        });
    }

}