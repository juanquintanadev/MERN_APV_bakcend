// importamos expres para poder asignarlo a una variable y obtener sus funcionalidades
import express from 'express';

// importamos la dependencia para poder acceder a las variables de entorno
import dotenv from 'dotenv';

// importamos la variable creada con la funcion para conectar a la bd
import conectarDB from './config/db.js';

// importamos los cors que son para proteger nuestra api, donde le vamos a pasar las urls que estan permitidas para consultar la bd
import cors from 'cors';

// vamos a importar el router de veterinarioRoutes donde al ser default le podemos poner el nombre que queremos, nosotros lo vamos a hacer mas descriptivo
import veteriarioRoutes from './routes/veterinarioRoutes.js';

// importamos el router de pacientes
import pacienteRoutes from './routes/pacienteRoutes.js';

// antes de iniciar la conexion a la bd obviamente iniciamos el dotenv para que escanee y busque el archivo con las variables de entorno
dotenv.config();

// iniciamos la conexion
conectarDB();

// asignamos express a la variable app para poder utilizar las funcionalidades
const app = express();
// aca vamos a colocar la opcion de JSON para los req y res de nuestra api
app.use(express.json());  


// -----------------------------------------------------------------------------------------------------------
// vamos a cargar las urls permitidas para que cors no cause problemas

// creamos un arreglo donde vamos a colocar las url permitidas para poder consultar la api
const urlPermitidas = [process.env.FRONTEND_URL];

// ahora vamos a cargar las opciones para poder pasarselas luego al cors
const corsOptions = {
    origin: function(origin, callback) {
        if(urlPermitidas.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Error de Cors, no permite acceso'));
        };
    },
};

app.use(cors(corsOptions));

// app.use(cors({
//     origin: '*'
// }));

//-----------------------------------------------------------------------------------------------------------------

// con use al visitar la pagina entre '' ejecuta el callback donde siempre se le pasa el reques y el response y utilizamos el res para mostrar en pantalla algo
// app.use('/', (req, res) => {
//     res.send('Hola mundo')
// });

// vamos a ir registrando las visitas a las diferentes paginas que tenemos

// aca vamos a registrar la visita a la api de los veterinarios y vamos a conectarla con su router
app.use('/api/veterinarios', veteriarioRoutes);

// creamos un nuevo endpoint para pacientes
app.use('/api/pacientes', pacienteRoutes);

// aca tambien utilizamos variable de entorno, ya que al realizar el deployment este se le asigna automaticamente, y si no lo encuentra como seria este caso se le asigna el puerto 4000
const PORT = process.env.PORT || 4000;

// iniciamos el servidor
app.listen(PORT, () => {
    console.log(`servidor desde el puerto ${PORT}`);
});
