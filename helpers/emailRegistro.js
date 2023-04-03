import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {

    // creamos la instancia de nodemailer para el transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // probamos que tenemos comunicacion correcta al guardar el registro en el servidor y enviarlos a esta funcion con todo lo que necesitamos.
    // datos es un objeto que enviamos con los datos. jaja
    // console.log(datos);

    // extraemos de los datos que mandamos desde el registro luego de salvar los datos en la bd
    const {nombre, email, token} = datos;

    // enviamos el email con la configuracion del transporter creada anteriormente
    const info = await transporter.sendMail({
        from: "APV - Administrador de pacientes de veterinarios",
        to: email,
        subject: 'Comprueba tu cuenta en APV',
        text: 'Comprueba tu cuenta en APV',
        html: `<p>Hola, ${nombre} comprueba tu cuenta en APV.</p>
            <p>Tu cuenta casi esta lista, temina de comprobarla haciendo
            <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Click Acá</a></p>
            <p>Si no realizaste el registro de esta pagina, ignora el mensaje</p>
        `,
    });

    console.log('Mensaje enviado: %s', info.messageId);
};

export default emailRegistro;