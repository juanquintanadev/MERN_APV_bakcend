// importamos el modelo de veterinario para poder mandarlo a la bse de datos
import Veterinario from "../models/Veterinario.js";

// importamos para generar el JWT
import generarJWT from "../helpers/generarJWT.js";

// importamos el generarId para mandar un nuevo token al email cuando nos olvidamos el password
import generarId from "../helpers/generarId.js";

// importamos el envio de email para registro
import emailRegistro from "../helpers/emailRegistro.js";

// importamos el helper para poder reestablecer el password para el envio de emails
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";


// funciones donde van a trabajar segun las llamen de las url visitadas por el usuario

// funcion de registrar que pasaremos al router para que se ejecute
const registrar = async (req, res) => { // async porque al momento de guardar al veterinario en la bd no sabemos cuanto va a tardar, entonces al momento de almacenar la informacion a la bd bloqueamos la siguiente linea con un await

    // probamos con un console log, al req.body que es lo que le estamos enviando desde el postman como un json
    // console.log(req.body);

    // aplicamos destructuring y separamos el email y el password enviados hacia el servidor
    
    // console.log(nombre);
    // console.log(email);
    // console.log(password);

    // revisar o prevenir usuarios duplicados
    const {email, nombre}= req.body;

    // buscamos si en la bd tenemos algun registro cuyo email sea igual al que mandamos al servidor
    const existeUsuario = await Veterinario.findOne({email}); // le pasamos una forma de objeto de busqueda, al tener la key y value el mismo nombre se pone una vez gracias a JS

    // condicion de si el resultado encuentra un usuario igual mostramos un mensaje
    if(existeUsuario) {
        const error = new Error('Usuario ya registrado');

        // colocamos un return para que detenga la ejecucion de esta funcion y cambiamos el estado y un mensaje para que podamos acceder desde el frontend
        return res.status(400).json({msg: error.message});
    };

    try {
        // vamos a almacenar un nuevo veterinario
        // aca vamos a crear una nueva instancia del veterinario con el modelo ya creado con su schema
        // utilizamos el req.body porque con esto tenemos la informacion o parte de la informacion que necesitamos
        const veterinario = new Veterinario(req.body);

        // al guardar en la bd no sabemos cuanto va a tardar, por lo tanto bloqueamos la siguiente linea hasta que se guarde o de error
        const veterinarioGuardado = await veterinario.save();

        // aca vamos a realizar el envio del email para la confirmacion del usuario con el token.
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token,
        });

        res.json(veterinarioGuardado); // le pasamos un objeto con la url y este se muestra

    } catch (error) {
        console.log(error);
    };
};

// aca mostramos la informacion del veterinario una vez iniciada la sesion en la autorizacion
const perfil = (req, res) => {

    // realizamos el destructuring para obtener los datos del veterinario en sesion
    const {veterinario} = req;

    // aca vamos a retornarla para mostrarla en el frontend
    res.json(veterinario);
};

const confirmar = async (req, res) => {
    // aca es cuando leemos datos de la url
    // console.log(req.params.token);

    // extraemos el token mandado por el usuario para poder buscarlo en la bd y compararlo y asi confirmar la cuenta
    const {token} = req.params;

    // aca vamos a comprobar si el token que mando el usuario existe
    const usuarioConfirmar = await Veterinario.findOne({token});
    // console.log(usuarioConfirmar);

    // en caso de que no encuentre ese token almacenado mandamos un msg tipo json
    if(!usuarioConfirmar) {
        const error = new Error('Token no válido');
        return res.status(404).json({msg: error.message});
    };

    // si pasamos la verificacion si existe o no el token, podemos mostrar por consola el resultado obtenido
    // console.log(usuarioConfirmar);
    // esta varibale nos muestra el objeto completo con todos los datos que contiene el token buscado

    // utilizaremos un try catch para guardar datos en el servidor
    try {
        // cambiamos los valores que queremos y luego salvamos ese registro
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();

        res.json({msg: 'Confirmado correctamente el usuario'});
    } catch (error) {
        console.log(error);
    };
};

const autenticar = async (req, res) => {

    // con esto podemos ver lo que el usuario coloca en un formulario, podemos extraer informacion necesaria
    // console.log(req.body);

    // vamos a comprobar si el usuario existe antes de autenticarlo
    // extraemos el email para buscar el usuario ingresado
    // extraemos el password ingresado en el form para comprobarlo con el de la bd
    const {email, password} = req.body;

    const usuario = await Veterinario.findOne({email});

    if(!usuario) {
        const error = new Error('El usuario no existe');
        return res.status(404).json({msg: error.message});
    };

    // vamos a comprobar si tiene confirmada la cuenta, de caso contrario no le permitimos el acceso
    // en usuario ya tenemos la instancia del usuario encontrado
    if(!usuario.confirmado) {
        const error = new Error('Tu cuenta no ha sido confirmada');
        return res.status(403).json({msg: error.message});
    };

    // commprobamos el password ingresado para el login con el que tenemos en el servidor
    // al consultar el servidor tiene que ser utilizado el await
    if(await usuario.comprobarPassword(password)) {
        
        // vemos que propiedad del objeto del usuario nos conviene para pasarle al token
        // console.log(usuario);

        // autenticamos el usuario con un JWT, al ser una funcion hay que mandarla a llamar para que la genere
        // pasamos el id del usuario para poder identificarlo mejor
        res.json({
            token: generarJWT(usuario.id),
            nombre: usuario.nombre,
            email: usuario.email,
            _id: usuario._id,
        });
    } else {
        const error = new Error('El password es incorrecto');
        return res.status(400).json({msg: error.message});
    };

    // generamos un jwt para poder 

};

const olvidePassword = async (req, res) => {
    // realizamos el destructuring al request, ya que estamos enviando al servidor informacion
    const {email} = req.body;

    // verificamos que extraemos el emial correctamente
    // console.log(email);

    // ahora buscamos si existe el usuario con ese email
    const existeVeterinario = await Veterinario.findOne({email});

    // si no existe el usuario mandamos el error y terminamos la funcion
    if(!existeVeterinario) {
        const error = new Error('No existe Veterinario con ese email');
        return res.status(400).json({msg: error.message});
    };

    // si existe el usuario vamos a modificar el servidor creando un nuevo token id nuevo
    // utilizamos trycatch por si tenemos algun error no nos rompa el codigo al ejecutarlo y muestre el error
    try {

        // generamos en el campo de token un nuevo id unico
        existeVeterinario.token = generarId();

        // luego lo guardamos en el servidor
        await existeVeterinario.save();

        // enviamos el email con las instrucciones creadas en el helpers
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token,
        })

        // generamos un email donde vamos a mandar ese id
        res.json({msg: 'Enviamos el codigo unico al email para verificarlo'});

    } catch (error) {
        console.log(error);
    };
};

const comprobarToken = async (req, res) => {

    // extraemos de la infomacion que estamos enviando al servidor antes de modificar el password
    const {token} = req.params;

    // aca vamos a buscar ese veterinario 
    const tokenValido = await Veterinario.findOne({token});

    // no utilizamos trycatch debido a que no vamos a cambiar nada en la bd solo vamos a validar el token
    if(tokenValido) {
        // el usuario si existe y el enlace es correcto
        res.json({msg: 'Token válido y el usuario existe'});
    } else {
        const error = new Error('Token no válido');
        return res.status(400).json({msg: error.message});
    };

    // paso siguiente es generar un nuevo password en la peticion post
};

const nuevoPassword = async (req, res) => {
    // vamos a extraer con params de la url y de body lo que el usuario escribe un formulario
    const {token} = req.params;
    const {password} = req.body;

    // buscamos el veterinario
    const veterinario = await Veterinario.findOne({token});

    if(!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({msg: error.message});
    };

    // al realizar cambios en el servidor vamos a utilizar trycatch
    try {
        // reseteamos el token y guardamos el password nuevo arriba del que esta guardado
        veterinario.token = null;
        veterinario.password = password;

        // vemos los cambios realizados, a esta altura todavia no guardamos en el servidor, entonces en el sgte console.log no aparece el password porque en el modelo hay un pre save
        // console.log(veterinario);

        // aca cuando guardamos en el servidor se ejecuta el bcrypt del modelo y hashea el password
        await veterinario.save();
        res.json({msg: 'Password modificado correctamente'});
        
    } catch (error) {
        console.log(error);
    };

};

const actualizarPerfil = async (req, res) => {

    // id seria el nombre que ponemos en el routes cuando colocamos la url y esta le asignamos el nombre de id
    // console.log(req.params.id);
    // console.log(req.body);

    // vamos a trabajar con el modelo buscando el veterinario que nos pasaron en el req.params.id
    const veterinario = await Veterinario.findById(req.params.id);
    
    // comprobamos que exista el veterianrio sino pasamos un error por res.json
    if(!veterinario) {
        const error = new Error('Hubo un error')
        return res.status(404).json({ msg: error.message});
    };

    // tambien si tenemos un cambio de email tenemos que comprobar que el nuevo email no este registrado
    // para ello extraemos el email que mando el usuario
    const {email} = req.body;

    // comprobamos que no exista primero validando que el email que ya estaba registrado no sea el mismo que nos manda el usuario
    if( veterinario.email !==  email) {

        // si son diferentes los emails osea el nuevo y el viejo
        // entonces buscamos en el modelo para ver si encontramos algun usuario con ese email
        const existeUsuario = await Veterinario.findOne({email});

        // si hay algun usuario con ese email ya creado entonces mandamos el error y terminamos la ejecucion
        if( existeUsuario) {
            const error = new Error('Email ya esta en uso')
            return res.status(404).json({ msg: error.message});
        };
    };

    // si existe el veterinarioy es un email valido para cambiar entonces guardamos los datos nuevos en el servidor
    try {
        
        // aca vamos a ir nombrando los nuevos campos que enviamos a la bd
        veterinario.nombre = req.body.nombre;
        veterinario.email = req.body.email;
        veterinario.web = req.body.web;
        veterinario.telefono = req.body.telefono;

        // una vez sincronizado y guardado todo en veterinario vamos a guardar los cambios en el servidor
        const veterianrioActualizado = await veterinario.save();

        // guardado en el servidor ya podemos realizar la respuesta para luego actualizar el auth en el provider de frontend
        res.json(veterianrioActualizado);

    } catch (error) {
        console.log(error);
    }
};

// crearemos una funcion para actualizar el password de un usuario ya logeado
const actualizarPassword = async (req, res) => {

    // el state de veterinario almcacenado en el request
    // console.log(req.veterinario);
    // console.log(req.body);

    // primero tenemos que leer los datos
    const {_id} = req.veterinario;
    const {pwd_actual, pwd_nuevo} = req.body;


    // comprobamos que el veterinario exista
    // vamos a trabajar con el modelo buscando el veterinario que nos pasaron en el req.params.id
    const veterinario = await Veterinario.findById(_id);
    
    // comprobamos que exista el veterianrio sino pasamos un error por res.json
    if(!veterinario) {
        const error = new Error('Hubo un error')
        return res.status(404).json({ msg: error.message});
    };


    // comprobamos el nuevo password donde vamos a comparar con el que esta en el modelo
    // ya que este utiliza bcrypt para hashearlo y compararlo
    if(await veterinario.comprobarPassword(pwd_actual)) {
        
        // utilizamos carteles para ver si es correcto o incorrecto
        // console.log('correcto');

        // almacenamos el nuevo password
        veterinario.password = pwd_nuevo;

        await veterinario.save();

        // si todo se guardo correctamente mandamos un mensaje 
        res.json({
            msg: 'Password cambiado correctamente',
        });
    
    } else {
        const error = new Error('El password actual no es correcto')
        return res.status(404).json({ msg: error.message});
    };

};

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword,
};