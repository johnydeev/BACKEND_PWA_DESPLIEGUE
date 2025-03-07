import Message from "../models/Message.model.js";
import { ServerError } from "../utils/error.utils.js";
import channelRepository from "./channel.repository.js";

class MessageRepository {

    async create({ sender_id , channel_id , content}){

        const channel_found = await channelRepository.findChannelById(channel_id)
        console.log("Channel encontrado: ",channel_found)
        if(!channel_found){
            throw new ServerError("Canal no encontrado",404)
        }

        if(!channel_found.workspace.members.includes(sender_id)){
            throw new ServerError("No eres miembro del workspace",404)
        }
        const new_message = await Message.create(
            {
                sender: sender_id,
                channel: channel_id,
                content
            }
        )
        return new_message
    }

    async findMessagesFromChannel({channel_id , user_id}){

        
        const channel_found = await channelRepository.findChannelById(channel_id)

        console.log("Canal encontrado: ", channel_found)
        if(!channel_found){
            throw new ServerError("Canal no encontrado",404)
        }
        if(!channel_found.workspace.members.includes(user_id)){
            throw new ServerError("No eres miembro", 404)
        }
        try{
            const messages_list = await Message.find({channel:channel_id}).populate('sender','username email')
            console.log(messages_list)
            return messages_list;
        }catch(error){
            console.log("Error en repo")
        }
        

        
    }
}

const messageRepository = new MessageRepository()

export default messageRepository