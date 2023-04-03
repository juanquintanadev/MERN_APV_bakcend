// importamos express para tener las opciones de routing
import express from 'express';

// vamos a importar los controladores
import { registrar, perfil, confirmar, autenticar, olvidePassword, comprobarToken, nuevoPassword, actualizarPerfil, actualizarPassword } from '../controllers/veterinarioController.js';

// creamos la variable donde utilizaremos las opciones del router de express
const router = express.Router();

// importamos la autenticacion del middleware para poder mostrar el perfil luego
import checkAuth from '../middleware/authMiddleware.js';

//--------------------------------------------------------------------------------------------------------
// AREA PUBLICA DONDE SE PUEDE ACCEDER SIN AUTENTICACION

// en este archivo vamos a tener todas las rutas relacionadas con los veterinarios

// cuando visitemos '/api/veterinarios' en nuestro archivo app principal en index.js, seria en este archivo visitar el raiz '/'
// acordarseeeee request es lo que le mandamos al servidor y response es la respuesta del servidor
router.post('/', registrar);// post porque vamos a enviar datos al servidor, por en el postman tambien ponemos post sino da error

// creamos un endpoint para confirmar el usuario con su token, esta es la pagina donde va a confirmar el registro
// creamos un endpoint dinamico en el cual vamos a leer en la funcion confirmar con req.params, es cuando leemos datos de la url
router.get('/confirmar/:token', confirmar);

// al enviar los datos por medio de un formulario, hay que utilizar post
router.post('/login', autenticar);

// aca tenemos otro endpoint donde vamos a entrar sin autenticacion y vamos a mandarle el email del usuario al servidor. POST
router.post('/olvide-password', olvidePassword); // en este paso vamos a generar y enviar al email del usuario el token


// enviamos al usuario una url con el nuevo token para comprobar que sea valido
// aca es donde el usuario define el password nuevo para almacenarlo
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);

//------------------------------------------------------------------------------------------------------------
// AREA PRIVADA DE ACCESO SOLO CON AUTENTICACION

// estas rutas solo se acceden cuando estas autenticado y se pueden ver solamente con el token generado
router.get('/perfil', checkAuth, perfil); // en este caso usamos get porque nos vamos a traer del servidor los datos obtenidos de los perfiles

// esta ruta es para actualizar el perfil del usuario veterinario.
router.put('/perfil/:id', checkAuth, actualizarPerfil)

// ruta para actualizar el password
router.put('/actualizar-password', checkAuth, actualizarPassword)


export default router;
