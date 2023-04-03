import nodemailer from 'nodemailer';

const emailOlvidePassword = async (datos) => {

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
        subject: 'Reestablece tu password',
        text: 'Reestablece tu password',
        html: `<p>Hola, ${nombre} reestablece tu cuenta en APV.</p>
            <p>Sigue las instrucciones para reestablecer tu password, haz
            <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Click Acá</a></p>
        `,
    });

    console.log('Mensaje enviado: %s', info.messageId);
};

export default emailOlvidePassword;