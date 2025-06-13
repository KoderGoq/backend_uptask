import type { Request, Response } from 'express';
import User from '../models/User';
import { hashPassword } from '../utils/auth';
import Token from '../models/Token';
import { generateToken } from '../utils/token';


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

      await Promise.allSettled([user.save(), token.save()]);

      res.send('Cuenta creada, revisa tu correo para confirmarla')
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la cuenta' })
    }
  }
}