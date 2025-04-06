# Proyecto CLON de Slack [SOLO BACKEND]

Slack es un software de comunicación y colaboración empresarial basado en la nube. Se clasifica como una herramienta de mensajería instantánea y gestión de trabajo en equipo, diseñada para mejorar la comunicación dentro de organizaciones y equipos de trabajo.

## Tech Stack

- **Runtime:** [Node.js](https://nodejs.org/)  ![Node.js](https://img.shields.io/badge/-Node.js-green?style=flat-square&logo=node.js&logoColor=white)  

- **Framework:** [Express](https://expressjs.com/)  ![Express](https://img.shields.io/badge/-Express-black?style=flat-square&logo=express&logoColor=white)  

- **Authentication:** [JSON Web Token (JWT)](https://jwt.io/)  ![JWT](https://img.shields.io/badge/-JWT-blueviolet?style=flat-square&logo=jsonwebtokens&logoColor=white)

- **Password Encryption:** [bcrypt](https://github.com/kelektiv/node.bcrypt.js) ![bcrypt](https://img.shields.io/badge/-bcrypt-orange?style=flat-square&logo=keepassdx&logoColor=white)

- **Mailing:** [Nodemailer](https://nodemailer.com/) ![Nodemailer](https://img.shields.io/badge/-Nodemailer-yellow?style=flat-square&logo=mailgun&logoColor=white)

---

**Aprendizages y Dificultades:**

A lo largo del curso afianze muchisimas cosas aprendidas a medias las cuales me brindaron claridad y seguridad en conocimientos gracias al curso dictado por por la UTN Profesor: Matias Gimenez. 
Entre los aprendizajes que se destacan son:

- Autenticacion con JWT.
- Middlewares.
- Evitar inyeccion de codigo SQL por formulario.
- Arquitectura MVC.
- Configuracion de variables de entorno, base de datos, entre otros.
- Migracion de base de datos.

Las dificultades mas recurrentes en mi caso son los handlebars y el tipado del proyecto con typescript. Quedara como deuda tecnica para la proxima version del proyecto.

## TODO LIST

- [x] Autenticacion con JWT
- [x] Confirmacion de correo con **Nodemailer**
- [x] Recuperacion de contraseña
- [x] Proteccion de rutas mediante middleware 
- [ ] Tipado
- [ ] Handlebars

## Para correr Localmente

1. Clonar repositorio

   ```bash
   git clone https://github.com/johnydeev/FRONTEND_PWA_DESPLIEGUE.git
   ```

2. Instalar dependencias

   ```bash
   npm i
   ```

3. Copiar the `.env example` como `.env` y cargar variables de entorno.

   ```bash
   cp .env example .env
   ```

4. Para correr el servidor localmente

   ```bash
   npm run dev
   ```
