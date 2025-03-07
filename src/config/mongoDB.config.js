import ENVIROMENT from "./enviroment.config.js";
import mongoose  from "mongoose";

const connectToMongoDB = async () => {
    try{
        await mongoose.connect(ENVIROMENT.MONGO_DB_URL);
        console.log(`Conectado a la base de datos: ${mongoose.connection.name}`);
    }catch(error){
        console.log(`Ocurrio un error al conectar la Base de Datos`, error)
    }
}

export default connectToMongoDB;