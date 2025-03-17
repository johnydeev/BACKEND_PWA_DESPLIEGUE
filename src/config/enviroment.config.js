import dotenv from "dotenv";

dotenv.config();

const ENVIROMENT = {
    PORT: process.env.PORT,
    MONGO_DB_URL: process.env.MONGO_DB_URL,
    SECRET_KEY_JWT: process.env.SECRET_KEY_JWT,
    EMAIL: process.env.EMAIL,
    EMAIL_KEY: process.env.EMAIL_KEY,
    URL_BACKEND: process.env.URL_BACKEND || "http://localhost:3000",
    URL_FRONTEND: process.env.URL_FRONTEND || "http://locahost:3000",
    MYSQL: {
        DB_NAME: process.env.MYSQL_DB_NAME,
        USERNAME: process.env.MYSQL_USER,
        PASSWORD: process.env.MYSQL_PASSWORD,
        HOST: process.env.MYSQL_HOST,
    },
};

for (let key in ENVIROMENT) {
    if (ENVIROMENT[key] === undefined) {
        console.error("OJO que la variable " + key + " esta indefinida");
    }
}

export default ENVIROMENT