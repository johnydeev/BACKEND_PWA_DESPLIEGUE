import channelService from "../service/channel.service.js";
import messageService from "../service/message.service.js";
import { handleError } from "../utils/error.utils.js";

export const createChannelController = async (req , res) =>{

    try{
        const { name } = req.body
        const { workspace_id } = req.params
        const user_id = req.user._id;
        
        const new_channel = await channelService.createChannel({name , workspace_id , member_id: user_id})

        return res.json({
            ok: true,
            status: 201,
            message: "Canal Creado!",
            data: {
                new_channel,
            },
        });

    } catch (error) {
        console.log("Error al crear el Canal");
        handleError(res, error);
    }
}

export const sendMessageToChannelController = async (req, res) => {
    try {
        const { channel_id } = req.params;
        const user_id = req.user._id;
        const {content} = req.body

        const new_message = await messageService.create({sender_id: user_id , channel_id, content})

        return res.json({
            ok: true,
            status: 201,
            message: "Mensaje Creado!",
            data: new_message
        });

    } catch (error) {
        console.log("error al enviar mensaje al canal");
        handleError(res, error);
    }
}

export const getMessagesListFromChannelController = async (req, res) =>{

    try{
        const { channel_id } = req.params
        const user_id = req.user._id

        const messages_list = await messageService.getMessagesByUser({
            channel_id,
            user_id,
        });
        
        console.log("Lista de mensajes: ", messages_list)

        return res.json({

            ok: true,
            status: 200,
            message: "Lista encontrada!",
            data: messages_list
        });
        
    }catch(error){
        console.log("error al Obtener los mensajes del canal");
        handleError(res, error);
    }
}

export const getChannelListByWorkspaceController = async (req, res) =>{

    const {workspace_id} = req.params
    console.log("Workspace_ID", workspace_id)
    const channel_list = await channelService.getChannelListByWorkspace({workspace_id})

    return res.json({
        ok:true,
        status: 200,
        message: 'Lista de canales x Workspace encontrada',
        data: channel_list
    })

}