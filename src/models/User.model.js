import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        default: false
    },
    verification_token:{
        type:String
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    modified_at:{
        type: Date
    },
    active: {
        type: Boolean,
        default: true
    },
    profile_img:{
        type: String,
        default: 'https://www.pngitem.com/pimgs/m/146-1462217_profile-icon-orange-png-transparent-png.png'
    }
})

const User = mongoose.model('User', userSchema)

export default User