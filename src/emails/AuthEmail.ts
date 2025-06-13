import { transporter } from '../config/nodemailer';

interface IEmail {
  email: string,
  name: string,
  token: string
}

export class AuthEmail {
  static senConfirmationEmail = async (user: IEmail) => {
    await transporter.sendMail({
      from: 'UpTask <admin@uptask.com>',
      to: user.email,
      subject: 'UpTask - Confirma tu cuenta',
      text: 'UpTask - Confirma tu cuenta',
      html: `<p> Hola ${user.name}, haz creado tu cuenta en UpTask, ya casi esta todo listo, solo debes confirmar tu cuenta </p>
        <p>Visita el siguiente enlace</p>
        <a href="">Confirmar cuenta<a/>
        <p>E Ingresa el siguiente codigo: <b>${user.token}</b></p>
        <p>Este token expira en 10 minutos</p>
      `
    })
  }
}