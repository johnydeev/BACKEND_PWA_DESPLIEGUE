import nodemailer from 'nodemailer'
import ENVIROMENT from './enviroment.config.js';

const transporter = nodemailer.createTransport(
    {
        service: 'gmail',
        auth: {
        user: ENVIROMENT.EMAIL,
        pass: ENVIROMENT.EMAIL_KEY,
        },
    }
);
const sendMail = async ({to, subject , html}) => {
    try{
        const data = await transporter.sendMail(
            {
                to,
                subject,
                html
            }
        )
    return data
    }catch(error){
        return error
    }
    
}

transporter.verify((err, success) => {
    if (err) {
        console.log("Verify error",err);
    } else {
        console.log("Server is ready to take our messages",success);
    }
})

export default sendMail