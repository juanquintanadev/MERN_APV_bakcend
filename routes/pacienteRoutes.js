// importamos express para todas sus funcionalidades
import express from 'express';

// importamos el checkAuth del middleware para poder confirmar que el usuario tiene un inicio de sesion para poder agregar un nuevo paciente y tambien para obtener pacientes
import checkAuth from '../middleware/authMiddleware.js';

// importamos las funciones del controlador
import { agregarPaciente, obtenerPacientes, obtenerPaciente, actualizarPaciente, eliminarPaciente } from '../controllers/pacienteController.js';

// asignamos las funcionalidades del router de express
const router = express.Router();

// importamos del controlador las funciones para registrar y mostrar pacientes

// cuando envio un post a la pagina principal de pacientes vamos a registrar un nuevo paciente
// cuando envio un get es que vamos a traer todos los pacientes relacionados con el veterinario en sesion
router.route('/').post(checkAuth, agregarPaciente).get(checkAuth, obtenerPacientes); 
// con el checkAuth vamos a proteger ese endpoint para registrar el usuario en express con req.veterinario y poder capturar esa informacion en agregarPaciente

// vamos a cumplir con las funciones del CRUD y vamos a buscar un paciente, editarlo y eliminarlo
router.route('/:id').get(checkAuth, obtenerPaciente).put(checkAuth, actualizarPaciente).delete(checkAuth, eliminarPaciente);

// exportamos default el router
export default router;