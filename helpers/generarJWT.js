// importamos la libreria de jwt
import jwt from 'jsonwebtoken';

// le mandamos el usuario para registrarlo y saber quien es
const generarJWT = (id) => {

    // utilizamos el jwt con sign para que nos cree uno nuevo
    return jwt.sign({id}, process.env.JWT_SECRET, {
        // estas son las opciones, en este caso cuanto tiempo tarda en expirar la sesion para pedir un token nuevo
        expiresIn: "30d",
    });
};

export default generarJWT;