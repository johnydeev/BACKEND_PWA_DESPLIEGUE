import channelRepository from "../repository/channel.repository.js";
import messageRepository from "../repository/message.repository.js";

export const createChannelController = async (req , res) =>{

    try{
        const { name } = req.body
        const { workspace_id } = req.params
        const user_id = req.user._id;

        const new_channel = await channelRepository.createChannel(name , workspace_id , user_id )

        console.log(name)

        return res.json({
            ok: true,
            status: 201,
            message: "Canal Creado!",
            data: {
                new_channel,
            },
        });

    } catch (error) {
        console.log("Error al crear el Canal", error);
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

export const sendMessageToChannelController = async (req, res) => {
    try {
        const { channel_id } = req.params;
        const user_id = req.user._id;
        const {content} = req.body

        const new_message = await messageRepository.create({sender_id: user_id , channel_id, content})

        return res.json({
            ok: true,
            status: 201,
            message: "Mensaje Creado!",
            data: {
                new_message,
            },
        });

    } catch (error) {
        console.log("error al enviar mensaje al canal", error);

        if (error.status) {
        return res.status(400).send({
            ok: false,
            status: error.status,
            message: error.message,
        });
        }

        res.status(500).send({
        status: 500,
        ok: false,
        message: "internal server error",
        });
    }
}

export const getMessagesListFromChannelController = async (req, res) =>{

    try{
        const { channel_id } = req.params
        const user_id = req.user._id

        const messages_list = await messageRepository.findMessagesFromChannel({channel_id, user_id})

        console.log("Lista de mensajes: ", messages_list)

        return res.json({

            ok: true,
            status: 200,
            message: "Lista encontrada!",
            data: {
                messages_list,
            },
        });

        
    }catch(error){
        console.log("error al Obtener los mensajes del canal", error);

        if (error.status) {
            return res.status(400).send({
                ok: false,
                status: error.status,
                message: error.message,
            });
        }

        res.status(500).send({
            status: 500,
            ok: false,
            message: "internal server error",
        });

    }
}