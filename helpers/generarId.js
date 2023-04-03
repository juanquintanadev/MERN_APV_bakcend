
// con este codigo vamos a ir generando id unicos y completos.
// .toString(32) convierte una cadena numerica en una cadena de caracteres
const generarId = () => {
    return Date.now().toString(32) + Math.random().toString(32).substring(2)
};

export default generarId;