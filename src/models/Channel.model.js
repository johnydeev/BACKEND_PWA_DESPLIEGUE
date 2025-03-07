import mongoose from "mongoose";

const channel_schema = new mongoose.Schema(
    
    {    
        channel:
        {
            type: String,
            required: true,
        },
        workspace:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Workspace'
        },
        created_at:
        {
            
            type: Date,
            default: Date.now()
        },
        create_by: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }
);
const Channel = mongoose.model("Channel", channel_schema);

export default Channel;