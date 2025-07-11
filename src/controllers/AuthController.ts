import type { Request, Response } from 'express';
import User from '../models/User';
import { checkPassowrd, hashPassword } from '../utils/auth';
import Token from '../models/Token';
import { generateToken } from '../utils/token';
import { AuthEmail } from '../emails/AuthEmail';
import { generateJWT } from '../utils/jwt';


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

      const token = generateJWT({ id: user.id });
      res.send(token);

    } catch (error) {
      res.status(500).json({ error: 'Error al Ingresar' })
    }
  }

  static requestConfirmationCode = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      // Usuario existe
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error('El usuario no esta registrado');
        res.status(404).json({ error: error.message });
        return;
      }

      if (user.confirmed) {
        const error = new Error('El usuario ya esta confirmado');
        res.status(403).json({ error: error.message });
        return;
      }

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

      res.send('Se envio un nuevo token a tu e-email')
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la cuenta' })
    }
  }

  static forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      // Usuario existe
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error('El usuario no esta registrado');
        res.status(404).json({ error: error.message });
        return;
      }

      // generar token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;
      await token.save()

      // Enviar email de confirmacion
      AuthEmail.sendPasswordResetToken({
        email: user.email,
        name: user.name,
        token: token.token
      })

      res.send('Revisa tu email y sigue las instrucciones')
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la cuenta' })
    }
  }

  static validateToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const tokenExist = await Token.findOne({ token });
      if (!tokenExist) {
        const error = new Error('Token no valido');
        res.status(404).json({ error: error.message });
        return;
      }
      res.send('Token valido, define tu nuevo password');

    } catch (error) {
      res.status(500).json({ error: 'Hubo un  al confirmar la cuenta' })
    }
  }

  static updatePasswordWithToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const { password } = req.body;
      const tokenExist = await Token.findOne({ token });
      if (!tokenExist) {
        const error = new Error('Token no valido');
        res.status(404).json({ error: error.message });
        return;
      }

      const user = await User.findById(tokenExist.user);
      user.password = await hashPassword(password);

      await Promise.allSettled([user.save(), tokenExist.deleteOne()]);

      res.send('El password se modifico correctamente');

    } catch (error) {
      res.status(500).json({ error: 'Hubo un  al confirmar la cuenta' })
    }
  }

  static user = async (req: Request, res: Response) => {
    res.json(req.user);
    return;
  }

  static updateProfile = async (req: Request, res: Response) => {
    const { name, email } = req.body;
    const userExist = await User.findOne({ email });

    if (userExist && userExist.id.toString() !== req.user.id.toString()) {
      const error = new Error('Ese email ya esta registrado');
      res.status(409).json({ error: error.message });
      return;
    }

    req.user.name = name;
    req.user.email = email;


    try {
      await req.user.save();
      res.send('Perfil Actualizado Correctamente');
    } catch (error) {
      res.status(500).json('Error al actualizar perfil');
    }
  }

  static changeUserPassword = async (req: Request, res: Response) => {
    const { current_password, password } = req.body;

    const user = await User.findById(req.user.id);

    const isPasswordCorrect = await checkPassowrd(current_password, user.password);
    if (!isPasswordCorrect) {
      const error = new Error('El password actual es incorrecto');
      res.status(401).json({ error: error.message });
      return;
    }

    try {
      user.password = await hashPassword(password);
      await user.save();
      res.send('El password se modifico correctamente')
    } catch (error) {
      res.status(500).json('Error al actualizar el password');
    }
  }

  static checkPassword = async (req: Request, res: Response) => {
    const { password } = req.body;

    const user = await User.findById(req.user.id);

    const isPasswordCorrect = await checkPassowrd(password, user.password);
    if (!isPasswordCorrect) {
      const error = new Error('El password es incorrecto');
      res.status(401).json({ error: error.message });
      return;
    }
    res.send('Password Correcto');
  }

}