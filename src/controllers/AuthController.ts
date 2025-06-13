import type { Request, Response } from 'express';
import User from '../models/User';
import { checkPassowrd, hashPassword } from '../utils/auth';
import Token from '../models/Token';
import { generateToken } from '../utils/token';
import { AuthEmail } from '../emails/AuthEmail';


export class AuthController {

  static createAccount = async (req: Request, res: Response) => {
    try {
      const { password, email } = req.body;

      // Prevenir duplicados
      const userExists = await User.findOne({ email });
      if (userExists) {
        const error = new Error('Correo ya esta registrado');
        res.status(409).json({ error: error.message });
        return;
      }

      // Crear nuevo usuario
      const user = new User(req.body);

      // hash Password
      user.password = await hashPassword(password);

      // generar token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      // Enviar email de confirmacion
      AuthEmail.senConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token
      })


      await Promise.allSettled([user.save(), token.save()]);

      res.send('Cuenta creada, revisa tu correo para confirmarla')
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la cuenta' })
    }
  }

  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const tokenExist = await Token.findOne({ token });
      if (!tokenExist) {
        const error = new Error('Token no valido');
        res.status(404).json({ error: error.message });
        return;
      }

      const user = await User.findById(tokenExist.user);
      user.confirmed = true

      await Promise.allSettled([user.save(), tokenExist.deleteOne()]);
      res.send('Cuenta confirmada correctamente');

    } catch (error) {
      res.status(500).json({ error: 'Hubo un  al confirmar la cuenta' })
    }
  }

  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error('Usuario no encontrado');
        res.status(404).json({ error: error.message });
        return;
      }

      if (!user.confirmed) {

        const token = new Token();
        token.user = user.id;
        token.token = generateToken();
        await token.save();

        AuthEmail.senConfirmationEmail({
          email: user.email,
          name: user.name,
          token: token.token
        })

        const error = new Error('La cuenta no ha sido confirmada, hemos enviado un nuevo e-mail de confirmacion');
        res.status(401).json({ error: error.message });
        return;
      }

      // Revisar password
      const isPasswordCorrect = await checkPassowrd(password, user.password);
      if (!isPasswordCorrect) {
        const error = new Error('Password Incorrecto');
        res.status(401).json({ error: error.message });
        return;
      }

      res.send('Autenticado..')

    } catch (error) {
      res.status(500).json({ error: 'Error al Ingresar' })
    }
  }
}