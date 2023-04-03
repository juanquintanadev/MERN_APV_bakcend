// importamos mongoose para trabajar con la tabla de veterinarios
import mongoose from "mongoose";

// importamos la dependecia de bcrypt para hashear passwords
import bcrypt from 'bcrypt';

// importamos el helper para generar un id unico
import generarId from "../helpers/generarId.js";

// con mongoose construimos el schema donde van almacenados los datos del veterinario
// no es necesario asignar id ya que mongoose lo asigna automaticamente
const veterinarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        trim: true, // elimina espacios en blanco al inicio y al final
        required: true, // con esto que es requerido tambien en el servidor
    },
    password: { // password requerido y lo vamos a generar con una libreria
        type: String,
        required: true,

    },
    email: { // este campo nos va a servir para iniciar sesion y vamos a mantener el registro de los usuarios porque requiere confirmar su cuenta
        type: String,
        required: true,
        unique: true, // debe ser un solo usuario por mail, osea que no se puede repetir
        trim: true,
    },
    telefono: {
        type: String,
        default: null, // en este caso no es requerido osea opcional
        trim: true,
    },
    web: { // no es obligatoria la url del veterinario
        type: String,
        default: null,
        trim: true,
    },
    token: {
        type: String,
        default: generarId(), // al ser una funcion que retorna un valor hay que mandarla a llamar para que funcione correctamente
    },
    confirmado: { // cuando mandamos la confirmacion de la cuenta al usuario y este la activa, entonces pasa su valor a true
        type: Boolean,
        default: false,
    },
});

// vamos a utilizar un pre de mongoose que es antes de que se guarde con save el registro, en este caso uilizaremos una funcion para hashear el password
// si esto fuera un arrrow function el this daria undefined
veterinarioSchema.pre('save', async function(next) {

    // comprobamos que el password que tenemos previamente al hasheo no tiene un hasheo previo
    // utilizaremos esta funcion de mongoose para ver si tiene una modificacion este campo
    // si no esta modificado entonces pasa donde creamos el hash del password
    if(!this.isModified('password')) { // aca es si esta condicion da false, seria si esta modificado y el not adelante da false y por lo tanto entra en la condicion.
        next();
    };

    // declaramos el hasheo generando 10 rondas
    const salt = await bcrypt.genSalt(10);
    // luego asignamos al campo de password el hasheo con la informacion del usuario + la generacion de hasheo
    this.password = await bcrypt.hash(this.password, salt);

    // console.log(this); // eliminando el registro previo y volviendo a ejecutar el nuevo registro de verinario nos muestra este this, en este caso es el objeto con toda la informacion del registro
});

// creamos un method al schema para comprobar el password ingresado por el usuario con el que tenemos en el servidor
// utilizamos delaracion de funcion para poder comparar con el password del modelo ya hasheado
veterinarioSchema.methods.comprobarPassword = async function(passwordFormulario) {

    // funcion de bcrypt compare que retorna true o false
    return await bcrypt.compare(passwordFormulario, this.password);
};

// creamos una variable para crear el modelo y asociarlo al schema que creamos anteriormente
const Veterinario = mongoose.model('Veterinario', veterinarioSchema);

// vamos a exportar como default esta variable para poder utilizarla en donde lo necesitemos
export default Veterinario;
