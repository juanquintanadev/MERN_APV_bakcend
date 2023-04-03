// importamos el modelo de paciente para poder almacenarlo en la bd
import Paciente from "../models/Paciente.js";



// creamos las funciones para registrar y obtener pacientes

const agregarPaciente = async (req, res) => {

    // generamos una nueva instancia de la informacion enviada al servidor y la guardamos en el modelo creado
    const paciente = new Paciente(req.body);

    // comprobamos los datos cargados en Postman para poder verlos
    // console.log(paciente);

    // podemos acceder a req.veterinario porque en el checkAuth lo almacenamos correctamente al comprobar el token creado en checkAuth
    // _id asi lo almacena mongoDB
    // console.log(req.veterinario._id);

    // asignamos en el modelo de paciente el id del veterinario
    paciente.veterinario = req.veterinario._id;

    // utilizamos trycatch para cuando vamos a modificar la bd 
    try {

        // probamos el paciente con el id ya cargado como mongo lo carga
        // console.log(paciente);
        
        // asignamos el paciente almacenado en una variable
        const pacienteAlmacenado = await paciente.save();
        res.json(pacienteAlmacenado);
        
    } catch (error) {
        console.log(error);
    };

};

const obtenerPacientes = async (req, res) => {
    
    // aca con esta linea de codigo traemos todos los pacientes que tengan el campo veterinario igual al de inicio de sesion en el cheqAuth
    const pacientes = await Paciente.find().where('veterinario').equals(req.veterinario);
    // console.log(pacientes);
    res.json(pacientes);
};

// SEGUIMOS CON EL CRUD PARA ADEMAS DE AGREGAR, BUSCAR, EDITAR Y ELIMINAR UN PACIENTE

// vamos a obtener un paciente en especifico
const obtenerPaciente = async (req, res) => {
    // con req.params obtenemos la informacion de la url
    const { id } = req.params;
    // con esto nos traemos el paciente segun el id que le pasamos a la bd
    const paciente = await Paciente.findById(id);

    // console.log(paciente)

    // tenemos que ver si el paciente que traemos coincide el veterinario que lo agrego con el que inicio sesion actualemte
    // pasamos los ids a string porque al ser objectId estos van a ser vistos o comparados de manera diferente y van a dar siempre error 
    // para evitar esto pasamos los dos valores a string y asi podemos compararlos sin problema.
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({msg: 'Accion no valida'});
    };

    // primero vemos si existe el paciente, sino existe mostramos ese error con su status
    if(paciente) {
        // si pasamos esa validacion del id que coincida con el veterinario logeado entonces mostramos la informacion del paciente buscado
        res.json(paciente);
    };
  
};

const actualizarPaciente = async (req, res) => {
    // con req.params obtenemos la informacion de la url
    const {id} = req.params;
    try {

        // con esto nos traemos el paciente segun el id que le pasamos a la bd
        const paciente = await Paciente.findById(id);

        // primero vemos si existe el paciente, sino existe mostramos ese error con su status
        if(!paciente) {
            return res.status(404).json({msg: 'Paciente no encontrado'});
        };

        // tenemos que ver si el paciente que traemos coincide el veterinario que lo agrego con el que inicio sesion actualemte
        // pasamos los ids a string porque al ser objectId estos van a ser vistos o comparados de manera diferente y van a dar siempre error 
        // para evitar esto pasamos los dos valores a string y asi podemos compararlos sin problema.
        if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
            return res.json({msg: 'Accion no valida'});
        };

        // aca vamos a actualizar el paciente una vez pasadas las validaciones
        // a cada campo vamos a asignarle los valores que el usuario escribe, pero si no escribio algun campo le grabamos el valor que tenia anteriormente
        // de esta manera evitamos errores al momento de guardarlo, ya que todos los campos son requeridos obligatoriamente
        paciente.nombre = req.body.nombre || paciente.nombre;
        paciente.propietario = req.body.propietario || paciente.propietario;
        paciente.email = req.body.email || paciente.email; // al campo de email en este caso le asignamos el del formulario del usuario, en el caso de que no escriba nada le asignamos el q estaba guardado previamente
        paciente.fecha = req.body.fecha || paciente.fecha;
        paciente.sintomas = req.body.sintomas || paciente.sintomas;

        // siempre que vamos a modificar el servidor trycatch
        try {
            const pacienteActualizado = await paciente.save();
            res.json(pacienteActualizado);
        } catch (error) {
            console.log(error);
        };
        
    } catch (error) {
        console.log(error);
    };
};

const eliminarPaciente = async (req, res) => {
    // con req.params obtenemos la informacion de la url
    const {id} = req.params;
    try {

        // con esto nos traemos el paciente segun el id que le pasamos a la bd
        const paciente = await Paciente.findById(id);

        // primero vemos si existe el paciente, sino existe mostramos ese error con su status
        if(!paciente) {
            return res.status(404).json({msg: 'Paciente no encontrado'});
        };

        // tenemos que ver si el paciente que traemos coincide el veterinario que lo agrego con el que inicio sesion actualemte
        // pasamos los ids a string porque al ser objectId estos van a ser vistos o comparados de manera diferente y van a dar siempre error 
        // para evitar esto pasamos los dos valores a string y asi podemos compararlos sin problema.
        if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
            return res.json({msg: 'Accion no valida'});
        };

        // vamos a eliminar el paciente obtenido 
        try {
            await paciente.deleteOne();
            res.json({msg: 'Paciente eliminado correctamente'});
        } catch (error) {
            console.log(error);
        };
        
    } catch (error) {
        console.log(error);
    };
};

export {    
    agregarPaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente,
};