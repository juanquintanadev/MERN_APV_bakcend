// esta funcion va a chequear y pasar al siguiente middleware cuando se cumpla la autorizacion del usuario
// nos van a mandar un token hacia aca y tenemos que chequearlo con los datos que tenemos en el servidor    

// importamos la libreria para comprobar el token que estamos mandando al servidor
import jwt from 'jsonwebtoken';

// importamos el modelo para poder buscar el usuario con el id proporcionado en el token
import Veterinario from '../models/Veterinario.js';

const checkAuth = async (req, res, next) => {

    // creamos una variable que se puede modificar con let para ir guardando los diferentes tokens cuando se van generando
    let token;

    // vamos a comprobar que tenemos un token que estan enviando y que sea de tipo bearer
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // aca una vez que tenemos el token tenemos que comprobarlo con la libreria de jwt

        // utilizamos el try catch para caer en el error cuando decifra el jwt
        try {

            // vamos a asignar a la variable token el valor que obtenemos del req.headers.authorization
            // utilizaremos la funcion para separar el Bearer del token
            // .split separa en un arreglo y toma como punto de separacion lo que nosotros le decimos, en este caso un espacio en blanco
            // al retornar 2 valores de la separacion elegimos el segundo valor, osea la posicion 1
            token = req.headers.authorization.split(' ')[1];

            // vemos el token que sea lo que esperamos
            // console.log(token);

            // ahora realizamos la verificacion
            // donde le pasamos el token enviado y la palabra secreta firmada nuestra
            // si al decodificarlo no es valido entonces directamente va al catch y manda el mensaje de error y con el return evitamos ciertos errores
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // esta variable se decodifica con la libreria y obtenemos la informacion que le pasamos para autenticar el usuario
            // decoded nos trae un objeto, por lo tanto tenemos acceso a sus elementos entre ellos id
            // console.log(decoded);

            // vamos a buscar el veterinario por su id, que lo obtuvimos en el decoded
            // utilizamos async await porque vamos a comunicarnos con el servidor
            // al pasarle el id utilizamos esa funcion especifica
            // utilizamos select para quitar del objeto que traemos campos que no requerimos ver datos sensibles
            // con req.veterinario lo que hacemos es agregarlo dentro de express para poder inciar la sesion con la informacion del veterinario
            req.veterinario = await Veterinario.findById(decoded.id).select('-password -token -confirmado');

            // una vez almacenada esa sesion ya podemos darle paso al siguiente middleware
            return next();
            
        } catch (error) {
            const errorToken = new Error('Token no válido');
            return res.status(404).json({msg: errorToken.message});
        }
    };

    // en el caso de que no tengamos el token y no este el bearer vamos a mostrar un mensaje de error
    // realizamos esta comprobacion y ejecutamos el error para que no se quede dando vuelas por la variable vacia
    if(!token) {
        const error = new Error('No existe token o inválido');
        res.status(404).json({msg: error.message});
    };

    // no hay un token valido entonces pasamos al siguiente middleware
    next();
};

export default checkAuth;