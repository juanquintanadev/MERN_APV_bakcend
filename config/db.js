// utilizamos mongoose para conectar con nuestra base de datos en mongo db
import mongoose from "mongoose";

// vamos a crear una funcion para conectar a la bd
// con async await porque la conexion puede tardar
// y un try catch por si en la conexion existe algun error
// siempre siempre try catch

const conectarDB = async () => {
    try {
        // creamos la variable de conexion con await, donde va la url extraida de mongo db y un objeto de configuracion que cambia seguido
        const db = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        // creamos una variable donde vamos a recibir una url y su puerto donde se esta conectando
        const url = `${db.connection.host}:${db.connection.port}`;

        // mostramos en consola la conexion
        console.log(`Mongo db conectado en: ${url}`);
    } catch (error) {
        // aca vamos a obtener una informacion mas detallada con ese metodo del error
        console.log(`ERROR: ${error.message}`);
        
        // el siguiente codigo nos imprime un mensaje de error
        process.exit(1);
    };
};

export default conectarDB;